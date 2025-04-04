
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

// Using mock API URL since the actual API isn't accessible in the sandbox
const API_URL = '/api/mock';

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

  // Mock data for development purposes
  private getMockData<T>(type: string): T {
    if (type === 'statusCount') {
      return {
        ignorado: 5,
        pendente: 10,
        iniciado: 2,
        sucesso: 15,
        erro: 3,
        total: 35
      } as unknown as T;
    } else if (type === 'projectInfo') {
      return {
        nome_projeto: "Integração MAX Sharepoint",
        ativo: true,
        descricao_simples: "Ferramenta responsável pela integração entre o MAX e o Sharepoint",
        descricao_acionamento: "De segunda a sexta às 09:00, 12:00 e 16:00",
        descricao_ingestao: "De segunda a sexta às 10:00 e 15:00"
      } as unknown as T;
    } else if (type === 'executions') {
      return {
        data: [
          {
            id: "1",
            status_proc: "CONCLUÍDO",
            numero_de_processo: "1234567-89.2023.8.26.0000",
            nome_do_documento: "petição_inicial",
            tipo_do_documento: "Cópia Integral",
            caminho_do_documento: "/sharepoint/documentos/123456",
            pasta_max: "654321",
            tempo_de_execucao: "00:02:15",
            data_cadastrado: "2023-04-01T10:30:00Z",
            data_inicio_exec: "2023-04-01T10:35:00Z",
            data_fim_exec: "2023-04-01T10:37:15Z"
          },
          {
            id: "2",
            status_proc: "ERRO",
            numero_de_processo: "9876543-21.2023.8.26.0000",
            nome_do_documento: "contestação",
            tipo_do_documento: "Cópia de processo",
            caminho_do_documento: "/sharepoint/documentos/987654",
            pasta_max: "123456",
            tempo_de_execucao: null,
            data_cadastrado: "2023-04-02T09:15:00Z",
            data_inicio_exec: "2023-04-02T09:20:00Z",
            data_fim_exec: null
          }
        ],
        page_count: 2
      } as unknown as T;
    } else if (type === 'tasks') {
      return {
        "max_processar_sharepoint_001": {
          is_running: true,
          erro_login: false,
          start_time: "2023-04-01T08:00:00Z",
          end_time: null
        }
      } as unknown as T;
    }
    
    return {} as T;
  }

  // Fetch RPA data with filters
  async pesquisar(filtro: RPAFiltro, paginavel: boolean = true): Promise<{ datas: RPAExecution[]; total: number }> {
    try {
      filtro.paginavel = paginavel;
      const params = this.buildParams(filtro);
      
      // For development, use mock data
      const mockData = this.getMockData<any>('executions');
      return {
        datas: mockData.data,
        total: mockData.page_count
      };
      
      // In production, use this code:
      // const response = await fetch(`${API_URL}/monitora_sharepoint/buscar/filtro?${params.toString()}`);
      // const data = await this.handleResponse<any>(response);
      // return {
      //   datas: data.data,
      //   total: data.page_count
      // };
    } catch (error: any) {
      toast.error(`Erro ao buscar dados: ${error.message}`);
      throw error;
    }
  }

  // Get status counts
  async getStatusCount(): Promise<StatusCount> {
    try {
      // For development, use mock data
      return this.getMockData<StatusCount>('statusCount');
      
      // In production, use this code:
      // const response = await fetch(`${API_URL}/monitora_sharepoint/count_status`);
      // return await this.handleResponse<StatusCount>(response);
    } catch (error: any) {
      toast.error(`Erro ao buscar contagem de status: ${error.message}`);
      throw error;
    }
  }

  // Get project info
  async getProjectInfo(projectId: string): Promise<ProjectInfo> {
    try {
      // For development, use mock data
      return this.getMockData<ProjectInfo>('projectInfo');
      
      // In production, use this code:
      // const response = await fetch(`${API_URL}/projetos/${projectId}`);
      // return await this.handleResponse<ProjectInfo>(response);
    } catch (error: any) {
      toast.error(`Erro ao buscar informações do projeto: ${error.message}`);
      throw error;
    }
  }

  // Delete a record
  async deletar(idRegistro: string): Promise<any> {
    try {
      // For development, mock success response
      toast.success('Registro excluído com sucesso');
      return { success: true };
      
      // In production, use this code:
      // const response = await fetch(`${API_URL}/monitora_sharepoint/deletar/${idRegistro}`, {
      //   method: 'DELETE'
      // });
      // const result = await this.handleResponse<any>(response);
      // toast.success('Registro excluído com sucesso');
      // return result;
    } catch (error: any) {
      toast.error(`Erro ao excluir registro: ${error.message}`);
      throw error;
    }
  }

  // Start task processing
  async processar(): Promise<any> {
    try {
      // For development, mock success response
      toast.success('Processamento iniciado com sucesso');
      return { success: true };
      
      // In production, use this code:
      // const response = await fetch(`${API_URL}/monitora_sharepoint/processar`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({})
      // });
      // const result = await this.handleResponse<any>(response);
      // toast.success('Processamento iniciado com sucesso');
      // return result;
    } catch (error: any) {
      toast.error(`Erro ao iniciar processamento: ${error.message}`);
      throw error;
    }
  }

  // Get tasks
  async getTasks(): Promise<Record<string, RPATask>> {
    try {
      // For development, use mock data
      return this.getMockData<Record<string, RPATask>>('tasks');
      
      // In production, use this code:
      // const response = await fetch(`${API_URL}/tarefas/obter/max_processar_sharepoint_`);
      // return await this.handleResponse<Record<string, RPATask>>(response);
    } catch (error: any) {
      toast.error(`Erro ao buscar tarefas: ${error.message}`);
      throw error;
    }
  }

  // Stop a task
  async stopTask(taskName: string): Promise<any> {
    try {
      // For development, mock success response
      toast.success(`Solicitação de parada para ${taskName} concluída`);
      return { success: true };
      
      // In production, use this code:
      // const response = await fetch(`${API_URL}/tarefas/parar`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({ taskName })
      // });
      // const result = await this.handleResponse<any>(response);
      // toast.success(`Solicitação de parada para ${taskName} concluída`);
      // return result;
    } catch (error: any) {
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
      toast.error(`Erro ao exportar dados: ${error.message}`);
      throw error;
    }
  }
}

export const rpaService = new RPAService();
