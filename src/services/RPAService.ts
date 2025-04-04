import { toast } from "sonner";
import { downloadExcel, formatRPAExecutionsForExcel } from "@/utils/excelUtils";

export class RPAFiltro {
  numero_de_processo?: string;
  nome_do_documento?: string;
  tipo_do_documento?: string;
  caminho_do_documento?: string;
  tempo_de_execucao?: string;
  pasta_max?: string;
  data_inicial?: string;
  data_final?: string;
  status_proc?: string;
  skip = 0;
  itensPorPagina = 10;
  sort = '-data_cadastrado';
  paginavel: boolean = true;
}

// Utiliza a URL da API real
const API_URL = 'https://api.sistemajur.com.br';

export interface RPATask {
  is_running: boolean;
  erro_login: boolean;
  start_time: string;
  end_time: string;
}

export interface ProjectInfo {
  nome_projeto: string;
  ativo: boolean;
  descricao_simples: string;
  descricao_acionamento: string;
  descricao_ingestao: string;
}

export interface RPAExecution {
  id: string;
  status_proc: string;
  numero_de_processo: string;
  nome_do_documento: string;
  tipo_do_documento: string;
  caminho_do_documento: string;
  pasta_max: string;
  tempo_de_execucao: string | null;
  data_cadastrado: string;
  data_inicio_exec: string | null;
  data_fim_exec: string | null;
}

export interface StatusCount {
  ignorado: number;
  pendente: number;
  iniciado: number;
  sucesso: number;
  erro: number;
  total: number;
}

class RPAService {
  // Build query parameters for API requests
  private buildParams(filtro: RPAFiltro): URLSearchParams {
    const params = new URLSearchParams();
    
    params.set('sort', filtro.sort);
    params.set('paginavel', filtro.paginavel.toString());
    
    if (filtro.skip) params.set('skip', filtro.skip.toString());
    if (filtro.itensPorPagina) params.set('page_size', filtro.itensPorPagina.toString());
    if (filtro.numero_de_processo) params.set('numero_de_processo', filtro.numero_de_processo);
    if (filtro.nome_do_documento) params.set('nome_do_documento', filtro.nome_do_documento);
    if (filtro.tipo_do_documento) params.set('tipo_do_documento', filtro.tipo_do_documento);
    if (filtro.caminho_do_documento) params.set('caminho_do_documento', filtro.caminho_do_documento);
    if (filtro.tempo_de_execucao) params.set('tempo_de_execucao', filtro.tempo_de_execucao);
    if (filtro.pasta_max) params.set('pasta_max', filtro.pasta_max);
    if (filtro.data_inicial) params.set('data_inicial', filtro.data_inicial);
    if (filtro.data_final) params.set('data_final', filtro.data_final);
    if (filtro.status_proc) params.set('status_proc', filtro.status_proc);
    
    return params;
  }

  // Process response and handle errors
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Erro desconhecido' }));
      const errorMessage = errorData.detail || 'Erro na requisição';
      throw new Error(errorMessage);
    }
    return await response.json();
  }

  // Fetch RPA data with filters
  async pesquisar(filtro: RPAFiltro, paginavel: boolean = true): Promise<{ datas: RPAExecution[]; total: number }> {
    try {
      filtro.paginavel = paginavel;
      const params = this.buildParams(filtro);
      
      // Usar a API real
      const response = await fetch(`${API_URL}/monitora_sharepoint/buscar/filtro?${params.toString()}`);
      const data = await this.handleResponse<any>(response);
      return {
        datas: data.data,
        total: data.page_count
      };
    } catch (error: any) {
      console.error('Error in pesquisar:', error);
      toast.error(`Erro ao buscar dados: ${error.message}`);
      // Em caso de falha na API, retorna dados vazios
      return {
        datas: [],
        total: 0
      };
    }
  }

  // Get status counts
  async getStatusCount(): Promise<StatusCount> {
    try {
      const response = await fetch(`${API_URL}/monitora_sharepoint/count_status`);
      return await this.handleResponse<StatusCount>(response);
    } catch (error: any) {
      console.error('Error in getStatusCount:', error);
      toast.error(`Erro ao buscar contagem de status: ${error.message}`);
      // Em caso de falha, retorna dados zeros
      return {
        ignorado: 0,
        pendente: 0,
        iniciado: 0,
        sucesso: 0,
        erro: 0,
        total: 0
      };
    }
  }

  // Get project info
  async getProjectInfo(projectId: string): Promise<ProjectInfo> {
    try {
      const response = await fetch(`${API_URL}/projetos/${projectId}`);
      return await this.handleResponse<ProjectInfo>(response);
    } catch (error: any) {
      console.error('Error in getProjectInfo:', error);
      toast.error(`Erro ao buscar informações do projeto: ${error.message}`);
      // Em caso de falha, retorna dados default
      return {
        nome_projeto: "Informações indisponíveis",
        ativo: false,
        descricao_simples: "Não foi possível carregar as informações do projeto",
        descricao_acionamento: "Informação indisponível",
        descricao_ingestao: "Informação indisponível"
      };
    }
  }

  // Delete a record
  async deletar(idRegistro: string): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/monitora_sharepoint/deletar/${idRegistro}`, {
        method: 'DELETE'
      });
      const result = await this.handleResponse<any>(response);
      toast.success('Registro excluído com sucesso');
      return result;
    } catch (error: any) {
      console.error('Error in deletar:', error);
      toast.error(`Erro ao excluir registro: ${error.message}`);
      throw error;
    }
  }

  // Start task processing
  async processar(): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/monitora_sharepoint/processar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });
      const result = await this.handleResponse<any>(response);
      toast.success('Processamento iniciado com sucesso');
      return result;
    } catch (error: any) {
      console.error('Error in processar:', error);
      toast.error(`Erro ao iniciar processamento: ${error.message}`);
      throw error;
    }
  }

  // Get tasks
  async getTasks(): Promise<Record<string, RPATask>> {
    try {
      const response = await fetch(`${API_URL}/tarefas/obter/max_processar_sharepoint_`);
      return await this.handleResponse<Record<string, RPATask>>(response);
    } catch (error: any) {
      console.error('Error in getTasks:', error);
      toast.error(`Erro ao buscar tarefas: ${error.message}`);
      // Em caso de falha, retorna objeto vazio
      return {};
    }
  }

  // Stop a task
  async stopTask(taskName: string): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/tarefas/parar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ taskName })
      });
      const result = await this.handleResponse<any>(response);
      toast.success(`Solicitação de parada para ${taskName} concluída`);
      return result;
    } catch (error: any) {
      console.error('Error in stopTask:', error);
      toast.error(`Erro ao parar tarefa: ${error.message}`);
      throw error;
    }
  }

  // Export data to Excel
  async exportToExcel(filtro: RPAFiltro): Promise<void> {
    try {
      // We get all data without pagination to export
      filtro.paginavel = false;
      const { datas } = await this.pesquisar(filtro, false);
      
      // Format data for Excel
      const formattedData = formatRPAExecutionsForExcel(datas);
      
      // Download Excel file
      downloadExcel('Relatorio_RPA', formattedData);
      
      toast.success('Exportação concluída com sucesso');
    } catch (error: any) {
      console.error('Error in exportToExcel:', error);
      toast.error(`Erro ao exportar dados: ${error.message}`);
      throw error;
    }
  }
}

export const rpaService = new RPAService();
