import { toast } from "sonner";
import { exportExcel } from "@/utils/excelUtils";

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

const API_URL = 'http://127.0.0.1:8000';
const TOKEN = '5438404c-ecf7-4eb2-87b7-7f419954eea7';

export interface ProjectInfo {
  nome_projeto: string;
  ativo: boolean;
  descricao_simples: string;
  descricao_acionamento: string;
  descricao_ingestao: string;
}

export interface RPAExecution {
  id: string;
  status: string;
  processNumber: string;
  documentName: string;
  documentType: string;
  documentPath: string;
  maxFolder: string;
  executionTime: string | null;
  registrationDate: string;
  startDate: string | null;
  endDate: string | null;
}

export interface StatusCount {
  ignorado: number;
  pendente: number;
  iniciado: number;
  sucesso: number;
  erro: number;
  total: number;
}

export interface FilterItem {
  field: string;
  matchMode: string;
  value: string;
  additionalValue?: string;
}

export const DOCUMENT_TYPES = [
  { label: "Cópia Integral", value: "Cópia Integral" },
  { label: "Cópia de processo", value: "Cópia de processo" }
];

export const STATUS_TYPES = [
  { label: "PENDENTE", value: "PENDENTE" },
  { label: "INICIADO", value: "INICIADO" },
  { label: "CONCLUÍDO", value: "CONCLUÍDO" },
  { label: "ERRO", value: "ERRO" },
  { label: "IGNORADO", value: "IGNORADO" }
];

class RPAService {
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

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.detail || 'Erro na requisição';
      throw new Error(errorMessage);
    }
    return await response.json();
  }

  async pesquisar(filtro: RPAFiltro, paginavel: boolean = true): Promise<{ datas: RPAExecution[]; total: number }> {
    try {
      filtro.paginavel = paginavel;
      const params = this.buildParams(filtro);
      const response = await fetch(`${API_URL}/monitora_sharepoint/buscar/filtro?${params.toString()}`, {
        mode: 'cors',
        headers: {
          'Authorization': `Bearer ${TOKEN}`
        }
      });
      const data = await this.handleResponse<any>(response);

      const mappedData = data.data.map(item => ({
        id: item.id,
        status: item.status_proc,
        processNumber: item.numero_de_processo,
        documentName: item.nome_do_documento,
        documentType: item.tipo_do_documento,
        documentPath: item.caminho_do_documento,
        maxFolder: item.pasta_max,
        executionTime: item.tempo_de_execucao,
        registrationDate: item.data_cadastrado,
        startDate: item.data_inicio_exec,
        endDate: item.data_fim_exec
      }));

      return {
        datas: mappedData,
        total: data.page_count
      };
    } catch (error: any) {
      toast.error(`Erro ao buscar dados: ${error.message}`);
      throw error;
    }
  }

  async getStatusCount(): Promise<StatusCount> {
    try {
      const response = await fetch(`${API_URL}/monitora_sharepoint/count_status`, {
        mode: 'cors',
        headers: {
          'Authorization': `Bearer ${TOKEN}`
        }
      });
      return await this.handleResponse<StatusCount>(response);
    } catch (error: any) {
      toast.error(`Erro ao buscar contagem de status: ${error.message}`);
      throw error;
    }
  }

  async getProjectInfo(projectId: string): Promise<ProjectInfo> {
    try {
      const response = await fetch(`${API_URL}/projetos/${projectId}`, {
        mode: 'cors',
        headers: {
          'Authorization': `Bearer ${TOKEN}`
        }
      });
      return await this.handleResponse<ProjectInfo>(response);
    } catch (error: any) {
      toast.error(`Erro ao buscar informações do projeto: ${error.message}`);
      throw error;
    }
  }

  async deletar(idRegistro: string): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/monitora_sharepoint/deletar/${idRegistro}`, {
        method: 'DELETE',
        mode: 'cors',
        headers: {
          'Authorization': `Bearer ${TOKEN}`
        }
      });
      const result = await this.handleResponse<any>(response);
      toast.success('Registro excluído com sucesso');
      return result;
    } catch (error: any) {
      toast.error(`Erro ao excluir registro: ${error.message}`);
      throw error;
    }
  }

  async exportExcel(filtro: RPAFiltro): Promise<void> {
    try {
      toast.success('Gerando a planilha Excel, aguarde!');
      filtro.paginavel = false;
      const { datas } = await this.pesquisar(filtro, false);
      
      const modeloAtualizarProcesso = datas.map(dados => ({
        "Status": dados.status || "---",
        "Numero de processo": dados.processNumber || "---",
        "Nome do documento": dados.documentName || "---",
        "Tipo do documento": dados.documentType || "---",
        "Caminho do documento": dados.documentPath || "---",
        "Pasta Max": dados.maxFolder || "---",
        "Tempo de Execução": dados.executionTime || "---",
        "Data Cadastrado": formatDate(dados.registrationDate),
        "Data Inicio Execução": formatDate(dados.startDate),
        "Data Fim Execução": formatDate(dados.endDate)
      }));
      
      exportExcel('Relatorio', modeloAtualizarProcesso);
      toast.success('Exportação concluída com sucesso');
    } catch (error: any) {
      toast.error(`Erro ao exportar dados: ${error.message}`);
      throw error;
    }
  }

  applyFilter(filtro: RPAFiltro, field: string, filter: { matchMode: string; value: string; additionalValue?: string } | null): RPAFiltro {
    const newFiltro = { ...filtro };
    
    // Remove the filter if null is passed
    if (!filter || (filter.value.trim() === '' && (!filter.additionalValue || filter.additionalValue.trim() === ''))) {
      switch (field) {
        case 'processNumber':
          newFiltro.numero_de_processo = undefined;
          break;
        case 'documentName':
          newFiltro.nome_do_documento = undefined;
          break;
        case 'documentType':
          newFiltro.tipo_do_documento = undefined;
          break;
        case 'documentPath':
          newFiltro.caminho_do_documento = undefined;
          break;
        case 'maxFolder':
          newFiltro.pasta_max = undefined;
          break;
        case 'status':
          newFiltro.status_proc = undefined;
          break;
        case 'registrationDate':
          newFiltro.data_inicial = undefined;
          newFiltro.data_final = undefined;
          break;
      }
      return newFiltro;
    }
    
    // Apply the filter with matchMode and value
    const { matchMode, value, additionalValue } = filter;
    
    switch (field) {
      case 'processNumber':
        newFiltro.numero_de_processo = `${matchMode},${value}`;
        break;
      case 'documentName':
        newFiltro.nome_do_documento = `${matchMode},${value}`;
        break;
      case 'documentType':
        newFiltro.tipo_do_documento = value;
        break;
      case 'documentPath':
        newFiltro.caminho_do_documento = `${matchMode},${value}`;
        break;
      case 'maxFolder':
        newFiltro.pasta_max = `${matchMode},${value}`;
        break;
      case 'status':
        newFiltro.status_proc = value;
        break;
      case 'registrationDate':
        // Special handling for date range - directly set data_inicial and data_final
        newFiltro.data_inicial = value || undefined;
        newFiltro.data_final = additionalValue || undefined;
        break;
    }
    
    return newFiltro;
  }
  
  updateSort(filtro: RPAFiltro, field: string): RPAFiltro {
    const newFiltro = { ...filtro };
    
    // Map the frontend field names to backend field names
    const fieldMap = {
      'processNumber': 'numero_de_processo',
      'documentName': 'nome_do_documento',
      'documentType': 'tipo_do_documento',
      'documentPath': 'caminho_do_documento',
      'maxFolder': 'pasta_max',
      'status': 'status_proc',
      'registrationDate': 'data_cadastrado',
      'startDate': 'data_inicio_exec',
      'endDate': 'data_fim_exec'
    };
    
    const backendField = fieldMap[field as keyof typeof fieldMap] || field;
    
    // Toggle sort direction
    if (newFiltro.sort === backendField) {
      newFiltro.sort = `-${backendField}`;
    } else if (newFiltro.sort === `-${backendField}`) {
      newFiltro.sort = backendField;
    } else {
      newFiltro.sort = backendField;
    }
    
    return newFiltro;
  }
}

// Helper function to format dates
function formatDate(dateString: string | null): string {
  if (!dateString) return "---";
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR') + " " + date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

export const rpaService = new RPAService();