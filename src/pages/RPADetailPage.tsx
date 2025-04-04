
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Play, 
  XCircle, 
  FileText, 
  RefreshCw, 
  Bot, 
  Download 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';
import { toast } from "sonner";
import Header from '@/components/Layout/Header';
import { RPA } from '@/components/RPAs/RPACard';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

// Extended RPA interface to include additional properties we need
interface ExtendedRPA extends RPA {
  projectInfo?: {
    name: string;
    active: boolean;
    description: string;
    automaticProcessingSchedule: string;
    automaticIngestionSchedule: string;
  };
  statusCount?: {
    ignored: number;
    pending: number;
    started: number;
    completed: number;
    error: number;
    total: number;
  };
  tasks?: Record<string, {
    is_running: boolean;
    erro_login: boolean;
    start_time: string;
    end_time: string;
  }>;
  executions?: Array<{
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
  }>;
}

// Mock data for RPA details
const mockRPADetails: ExtendedRPA = {
  id: "1",
  name: "Processamento de Faturas",
  description: "Automatização do processo de captura e classificação de faturas recebidas por email.",
  status: "active",
  category: "Financeiro",
  lastExecution: "Hoje, 14:30",
  favorite: true,
  projectInfo: {
    name: "Processamento de Faturas",
    active: true,
    description: "Automatização do processo de captura e classificação de faturas recebidas por email.",
    automaticProcessingSchedule: "Diariamente às 08:00",
    automaticIngestionSchedule: "A cada 30 minutos"
  },
  statusCount: {
    ignored: 2,
    pending: 5,
    started: 1,
    completed: 42,
    error: 3,
    total: 53
  },
  tasks: {
    "max_processar_sharepoint_1": {
      is_running: true,
      erro_login: false,
      start_time: "2023-07-15T08:00:00",
      end_time: "2023-07-15T08:30:00"
    },
    "max_processar_sharepoint_2": {
      is_running: false,
      erro_login: true,
      start_time: "2023-07-15T07:00:00",
      end_time: "2023-07-15T07:15:00"
    }
  },
  executions: [
    {
      id: "1",
      status: "CONCLUÍDO",
      processNumber: "2023/1234-5",
      documentName: "fatura_mensal_julho",
      documentType: "Fatura",
      documentPath: "/sharpoint/financeiro/faturas/2023/",
      maxFolder: "F-2023-1234",
      executionTime: "00:03:45",
      registrationDate: "2023-07-15T08:00:00",
      startDate: "2023-07-15T08:01:00",
      endDate: "2023-07-15T08:04:45"
    },
    {
      id: "2",
      status: "ERRO",
      processNumber: "2023/1235-6",
      documentName: "fatura_servico_terceiros",
      documentType: "Fatura",
      documentPath: "/sharpoint/financeiro/faturas/2023/",
      maxFolder: "F-2023-1235",
      executionTime: "00:01:23",
      registrationDate: "2023-07-15T09:00:00",
      startDate: "2023-07-15T09:01:00",
      endDate: "2023-07-15T09:02:23"
    },
    {
      id: "3",
      status: "PENDENTE",
      processNumber: "2023/1236-7",
      documentName: "fatura_agosto_previsao",
      documentType: "Fatura",
      documentPath: "/sharpoint/financeiro/faturas/2023/",
      maxFolder: "F-2023-1236",
      executionTime: null,
      registrationDate: "2023-07-15T10:00:00",
      startDate: null,
      endDate: null
    },
    {
      id: "4",
      status: "INICIADO",
      processNumber: "2023/1237-8",
      documentName: "fatura_consultoria",
      documentType: "Fatura",
      documentPath: "/sharpoint/financeiro/faturas/2023/",
      maxFolder: "F-2023-1237",
      executionTime: null,
      registrationDate: "2023-07-15T11:00:00",
      startDate: "2023-07-15T11:01:00",
      endDate: null
    },
    {
      id: "5",
      status: "IGNORADO",
      processNumber: "2023/1238-9",
      documentName: "fatura_duplicada",
      documentType: "Fatura",
      documentPath: "/sharpoint/financeiro/faturas/2023/",
      maxFolder: "F-2023-1238",
      executionTime: "00:00:30",
      registrationDate: "2023-07-15T12:00:00",
      startDate: "2023-07-15T12:01:00",
      endDate: "2023-07-15T12:01:30"
    }
  ]
};

// Helper function to format dates
const formatDate = (dateString) => {
  if (!dateString) return "---";
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR') + " " + date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const RPADetailPage = () => {
  const { id } = useParams();
  const [rpa, setRpa] = useState<ExtendedRPA | null>(null);
  const [loading, setLoading] = useState(true);
  const [tasksDialogOpen, setTasksDialogOpen] = useState(false);
  const [confirmExportDialogOpen, setConfirmExportDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      setRpa(mockRPADetails);
      setLoading(false);
    }, 500);
  }, [id]);

  const handleExecute = () => {
    toast.success(`Iniciando execução: ${rpa?.name}`);
  };

  const handleReportIncident = () => {
    window.open(
      'https://dev.azure.com/example/report-incident',
      '_blank'
    );
  };

  const goToMaxFolder = (folderId) => {
    if (!folderId) return;
    window.open(
      `https://max.sistemajur.com.br/Processo/FiltrarProcesso/DetalhesProcesso/?idProc=${folderId}&pasta=${folderId}`,
      '_blank'
    );
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success('Texto copiado com sucesso.');
        setCopiedText(text);
        setCopiedId(id);
        setTimeout(() => {
          setCopiedText(null);
          setCopiedId(null);
        }, 5000);
      })
      .catch(() => toast.error('Erro ao copiar texto.'));
  };

  const exportToExcel = () => {
    setConfirmExportDialogOpen(false);
    toast.success('Exportando dados para Excel...');
    // Implementation would go here
  };

  const startTask = () => {
    toast.success('Tarefa inicializada com sucesso.');
  };

  const stopTask = (taskKey) => {
    toast.success(`Solicitação de parada para ${taskKey} concluída`);
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'CONCLUÍDO': return "bg-green-200 text-green-700 border-green-300";
      case 'ERRO': return "bg-red-200 text-red-700 border-red-300";
      case 'PENDENTE': return "bg-yellow-200 text-yellow-700 border-yellow-300";
      case 'INICIADO': return "bg-blue-200 text-blue-700 border-blue-300";
      case 'IGNORADO': return "bg-gray-200 text-gray-700 border-gray-300";
      default: return "bg-gray-200 text-gray-700 border-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'CONCLUÍDO': return <CheckCircle className="h-4 w-4" />;
      case 'ERRO': return <AlertTriangle className="h-4 w-4" />;
      case 'PENDENTE': return <Clock className="h-4 w-4" />;
      case 'INICIADO': return <Play className="h-4 w-4" />;
      case 'IGNORADO': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const filteredExecutions = filterStatus && rpa?.executions
    ? rpa.executions.filter(exec => exec.status === filterStatus) 
    : rpa?.executions;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link to="/rpas">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <Header pageTitle={rpa?.name || 'Detalhes do RPA'} />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button variant="destructive" onClick={handleReportIncident}>
            <AlertTriangle className="h-4 w-4 mr-2" />
            Registrar Incidente
          </Button>
          <Button variant="secondary" onClick={() => setTasksDialogOpen(true)}>
            <Bot className="h-4 w-4 mr-2" />
            Monitorar Robô
          </Button>
          <Button variant="outline" onClick={() => setConfirmExportDialogOpen(true)}>
            <FileText className="h-4 w-4 mr-2" />
            Exportar Excel
          </Button>
        </div>
      </div>

      {rpa?.projectInfo && (
        <Card className="p-4">
          <CardContent className="p-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold">
                  {rpa.projectInfo.name}
                </h3>
                {rpa.projectInfo.active ? (
                  <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Ativo
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-200">
                    <XCircle className="h-3 w-3 mr-1" />
                    Inativo
                  </Badge>
                )}
              </div>
              <p className="text-base text-gray-900">{rpa.projectInfo.description}</p>
              <div className="text-sm text-gray-700">
                <strong>Horário de Processamento Automático:</strong> {rpa.projectInfo.automaticProcessingSchedule}
              </div>
              <div className="text-sm text-gray-700">
                <strong>Horário de Ingestão Automático:</strong> {rpa.projectInfo.automaticIngestionSchedule}
              </div>
              <div className="text-sm text-gray-700">
                <strong>Nota:</strong> Dê um duplo clique em um registro da tabela para copiar o texto.
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow" 
          onClick={() => setFilterStatus('IGNORADO')}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="block text-gray-500 font-medium mb-1">Ignorado</span>
                <div className="text-gray-900 font-bold text-2xl">{rpa?.statusCount?.ignored || 0}</div>
              </div>
              <div className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full">
                <XCircle className="text-gray-700 h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow" 
          onClick={() => setFilterStatus('PENDENTE')}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="block text-gray-500 font-medium mb-1">Pendente</span>
                <div className="text-gray-900 font-bold text-2xl">{rpa?.statusCount?.pending || 0}</div>
              </div>
              <div className="w-10 h-10 flex items-center justify-center bg-yellow-200 rounded-full">
                <Clock className="text-yellow-700 h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow" 
          onClick={() => setFilterStatus('INICIADO')}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="block text-gray-500 font-medium mb-1">Iniciado</span>
                <div className="text-gray-900 font-bold text-2xl">{rpa?.statusCount?.started || 0}</div>
              </div>
              <div className="w-10 h-10 flex items-center justify-center bg-blue-200 rounded-full">
                <Play className="text-blue-700 h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow" 
          onClick={() => setFilterStatus('CONCLUÍDO')}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="block text-gray-500 font-medium mb-1">Concluído</span>
                <div className="text-gray-900 font-bold text-2xl">{rpa?.statusCount?.completed || 0}</div>
              </div>
              <div className="w-10 h-10 flex items-center justify-center bg-green-200 rounded-full">
                <CheckCircle className="text-green-700 h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow" 
          onClick={() => setFilterStatus('ERRO')}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="block text-gray-500 font-medium mb-1">Erros</span>
                <div className="text-gray-900 font-bold text-2xl">{rpa?.statusCount?.error || 0}</div>
              </div>
              <div className="w-10 h-10 flex items-center justify-center bg-red-200 rounded-full">
                <AlertTriangle className="text-red-700 h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow col-span-full md:col-span-1" 
          onClick={() => setFilterStatus(null)}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="block text-gray-500 font-medium mb-1">Total</span>
                <div className="text-gray-900 font-bold text-2xl">{rpa?.statusCount?.total || 0}</div>
              </div>
              <div className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full">
                <span className="text-gray-700 text-xl font-bold">∑</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white shadow rounded-md overflow-x-auto">
        <div className="px-4 py-3 border-b flex justify-between items-center">
          <h3 className="text-lg font-medium">
            Registros {filterStatus ? `(${filterStatus})` : ''}
          </h3>
          {filterStatus && (
            <Button variant="ghost" size="sm" onClick={() => setFilterStatus(null)}>
              Mostrar todos
            </Button>
          )}
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Número de processo</TableHead>
              <TableHead>Nome do documento</TableHead>
              <TableHead>Tipo do documento</TableHead>
              <TableHead>Caminho do documento</TableHead>
              <TableHead>Pasta Max</TableHead>
              <TableHead>Tempo de Execução</TableHead>
              <TableHead>Data cadastrado</TableHead>
              <TableHead>Data Início Execução</TableHead>
              <TableHead>Data Fim Execução</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExecutions && filteredExecutions.length > 0 ? (
              filteredExecutions.map((exec) => (
                <TableRow key={exec.id}>
                  <TableCell 
                    className={`cursor-pointer ${copiedText === exec.status && copiedId === exec.id ? 'bg-blue-50' : ''}`}
                    onDoubleClick={() => copyToClipboard(exec.status, exec.id)}
                  >
                    <Badge className={getStatusVariant(exec.status)} variant="outline">
                      {getStatusIcon(exec.status)}
                      <span className="ml-1">{exec.status}</span>
                    </Badge>
                  </TableCell>
                  <TableCell 
                    className={`cursor-pointer ${copiedText === exec.processNumber && copiedId === exec.id ? 'bg-blue-50' : ''}`}
                    onDoubleClick={() => copyToClipboard(exec.processNumber, exec.id)}
                  >
                    {exec.processNumber || '---'}
                  </TableCell>
                  <TableCell 
                    className={`cursor-pointer ${copiedText === exec.documentName && copiedId === exec.id ? 'bg-blue-50' : ''}`}
                    onDoubleClick={() => copyToClipboard(exec.documentName, exec.id)}
                  >
                    {exec.documentName ? exec.documentName.split('_').join(' ') : '---'}
                  </TableCell>
                  <TableCell 
                    className={`cursor-pointer ${copiedText === exec.documentType && copiedId === exec.id ? 'bg-blue-50' : ''}`}
                    onDoubleClick={() => copyToClipboard(exec.documentType, exec.id)}
                  >
                    {exec.documentType || '---'}
                  </TableCell>
                  <TableCell 
                    className={`cursor-pointer ${copiedText === exec.documentPath && copiedId === exec.id ? 'bg-blue-50' : ''}`}
                    onDoubleClick={() => copyToClipboard(exec.documentPath, exec.id)}
                  >
                    {exec.documentPath || '---'}
                  </TableCell>
                  <TableCell 
                    className={`cursor-pointer ${copiedText === exec.maxFolder && copiedId === exec.id ? 'bg-blue-50' : ''}`}
                    onClick={() => goToMaxFolder(exec.maxFolder)}
                    onDoubleClick={() => copyToClipboard(exec.maxFolder, exec.id)}
                  >
                    {exec.maxFolder || '---'}
                  </TableCell>
                  <TableCell>
                    {exec.executionTime || '---'}
                  </TableCell>
                  <TableCell>
                    {formatDate(exec.registrationDate)}
                  </TableCell>
                  <TableCell>
                    {formatDate(exec.startDate)}
                  </TableCell>
                  <TableCell>
                    {formatDate(exec.endDate)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-6">
                  Nenhum registro encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Tasks Dialog */}
      <Dialog open={tasksDialogOpen} onOpenChange={setTasksDialogOpen}>
        <DialogContent className="sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle>Robôs</DialogTitle>
            <DialogDescription>
              Esses processos são executados automaticamente diariamente.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rpa?.tasks && Object.entries(rpa.tasks).map(([key, task], index) => (
              <Card key={key} className="p-4">
                <div className={task.is_running ? "bg-green-300 h-2 rounded-t-md -mt-4 -mx-4 mb-3" : "bg-red-300 h-2 rounded-t-md -mt-4 -mx-4 mb-3"}></div>
                <div className="space-y-2">
                  <div>
                    <span className="font-semibold">Identificador:</span> {key}
                  </div>
                  <div>
                    <span className="font-semibold">Erro Login:</span>{' '}
                    <span className={task.erro_login ? "text-green-600" : "text-red-600"}>
                      {task.erro_login ? 'Sim' : 'Não'}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold">Início:</span> {formatDate(task.start_time)}
                  </div>
                  <div>
                    <span className="font-semibold">Término:</span> {formatDate(task.end_time)}
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold">Status:</span>{' '}
                    {task.is_running && (
                      <span className="inline-block h-4 w-4 mr-1 rounded-full border-2 border-t-transparent border-blue-600 animate-spin ml-2"></span>
                    )}
                    <span className={task.is_running ? "text-green-600 ml-1" : "text-red-600 ml-1"}>
                      {task.is_running ? 'Em Execução' : 'Parado'}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-4 pt-2 border-t">
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={task.is_running}
                      onClick={startTask}
                    >
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Processar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={!task.is_running}
                      onClick={() => stopTask(key)}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Parar
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Export Confirmation Dialog */}
      <Dialog open={confirmExportDialogOpen} onOpenChange={setConfirmExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmação de Exportação</DialogTitle>
            <DialogDescription>
              Tem certeza de que deseja exportar os dados para um arquivo Excel?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmExportDialogOpen(false)}>
              Não
            </Button>
            <Button onClick={exportToExcel}>
              <Download className="h-4 w-4 mr-1" />
              Sim, Exportar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RPADetailPage;
