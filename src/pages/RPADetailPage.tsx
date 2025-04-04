
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
import { rpaService, RPAFiltro, RPAExecution, StatusCount, ProjectInfo, RPATask } from '@/services/RPAService';

// Extended RPA interface to include additional properties we need
interface ExtendedRPA extends RPA {
  projectInfo?: ProjectInfo;
  statusCount?: StatusCount;
  tasks?: Record<string, RPATask>;
  executions?: RPAExecution[];
}

// Helper function to format dates
const formatDate = (dateString: string | null) => {
  if (!dateString) return "---";
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR') + " " + date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const RPADetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [rpa, setRpa] = useState<ExtendedRPA | null>(null);
  const [loading, setLoading] = useState(true);
  const [tasksDialogOpen, setTasksDialogOpen] = useState(false);
  const [confirmExportDialogOpen, setConfirmExportDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filtro] = useState(new RPAFiltro());

  // Fetch RPA data
  const fetchRPAData = async () => {
    setLoading(true);
    try {
      // In a real application, we would fetch the RPA by id
      // For now we'll use the mock data structure but in the future we'd do:
      // const rpaData = await fetchRPAById(id);
      
      if (!id) {
        toast.error("ID do RPA não fornecido");
        setLoading(false);
        return;
      }
      
      // Create a base RPA object
      const baseRPA: ExtendedRPA = {
        id: id,
        name: "Carregando...",
        description: "Carregando...",
        status: "active",
        category: "Carregando...",
        lastExecution: "Carregando...",
        favorite: false,
      };
      
      setRpa(baseRPA);
      
      // Fetch status counts
      const statusCount = await rpaService.getStatusCount();
      
      // Fetch project info (in a real app we'd have the project ID from the RPA)
      const projectId = '6716b7026b50052d250027df'; // This would come from the RPA data
      const projectInfo = await rpaService.getProjectInfo(projectId);
      
      // Fetch executions
      const { datas: executions } = await rpaService.pesquisar(filtro);
      
      // Update the RPA with all fetched data
      setRpa({
        ...baseRPA,
        name: projectInfo.nome_projeto,
        description: projectInfo.descricao_simples,
        projectInfo: projectInfo,
        statusCount: statusCount,
        executions: executions
      });
    } catch (error) {
      console.error("Error fetching RPA data:", error);
      toast.error("Erro ao carregar dados do RPA");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchRPAData();
    
    // Set up interval for refreshing status counts
    const interval = setInterval(() => {
      rpaService.getStatusCount()
        .then(statusCount => {
          setRpa(prev => {
            if (!prev) return prev;
            return {
              ...prev,
              statusCount: statusCount
            };
          });
        })
        .catch(error => console.error("Error refreshing status counts:", error));
        
      // If tasks dialog is open, refresh tasks
      if (tasksDialogOpen) {
        fetchTasks();
      }
    }, 5000); // Refresh every 5 seconds
    
    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [id, tasksDialogOpen]);

  const handleExecute = () => {
    toast.success(`Iniciando execução: ${rpa?.name}`);
  };

  const handleReportIncident = () => {
    window.open(
      'https://dev.azure.com/example/report-incident',
      '_blank'
    );
  };

  const goToMaxFolder = (folderId: string) => {
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

  const fetchTasks = async () => {
    try {
      const tasks = await rpaService.getTasks();
      setRpa(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          tasks
        };
      });
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleOpenTasksDialog = async () => {
    await fetchTasks();
    setTasksDialogOpen(true);
  };

  const exportToExcel = async () => {
    setConfirmExportDialogOpen(false);
    toast.success('Exportando dados para Excel...');
    try {
      await rpaService.exportToExcel(filtro);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
    }
  };

  const startTask = async () => {
    try {
      await rpaService.processar();
      await fetchTasks();
    } catch (error) {
      console.error("Error starting task:", error);
    }
  };

  const stopTask = async (taskKey: string) => {
    try {
      await rpaService.stopTask(taskKey);
      await fetchTasks();
    } catch (error) {
      console.error("Error stopping task:", error);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'CONCLUÍDO': return "bg-green-200 text-green-700 border-green-300";
      case 'ERRO': return "bg-red-200 text-red-700 border-red-300";
      case 'PENDENTE': return "bg-yellow-200 text-yellow-700 border-yellow-300";
      case 'INICIADO': return "bg-blue-200 text-blue-700 border-blue-300";
      case 'IGNORADO': return "bg-gray-200 text-gray-700 border-gray-300";
      default: return "bg-gray-200 text-gray-700 border-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
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
    ? rpa.executions.filter(exec => exec.status_proc === filterStatus) 
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
          <Button variant="secondary" onClick={handleOpenTasksDialog}>
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
                  {rpa.projectInfo.nome_projeto}
                </h3>
                {rpa.projectInfo.ativo ? (
                  <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Ativo
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-200">
                    <XCircle className="h-3 w-3 mr-1" />
                    Inativo
                  </Badge>
                )}
              </div>
              <p className="text-base text-gray-900">{rpa.projectInfo.descricao_simples}</p>
              <div className="text-sm text-gray-700">
                <strong>Horário de Processamento Automático:</strong> {rpa.projectInfo.descricao_acionamento}
              </div>
              <div className="text-sm text-gray-700">
                <strong>Horário de Ingestão Automático:</strong> {rpa.projectInfo.descricao_ingestao}
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
                <div className="text-gray-900 font-bold text-2xl">{rpa?.statusCount?.ignorado || 0}</div>
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
                <div className="text-gray-900 font-bold text-2xl">{rpa?.statusCount?.pendente || 0}</div>
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
                <div className="text-gray-900 font-bold text-2xl">{rpa?.statusCount?.iniciado || 0}</div>
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
                <div className="text-gray-900 font-bold text-2xl">{rpa?.statusCount?.sucesso || 0}</div>
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
                <div className="text-gray-900 font-bold text-2xl">{rpa?.statusCount?.erro || 0}</div>
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
                    className={`cursor-pointer ${copiedText === exec.status_proc && copiedId === exec.id ? 'bg-blue-50' : ''}`}
                    onDoubleClick={() => copyToClipboard(exec.status_proc, exec.id)}
                  >
                    <Badge className={getStatusVariant(exec.status_proc)} variant="outline">
                      {getStatusIcon(exec.status_proc)}
                      <span className="ml-1">{exec.status_proc}</span>
                    </Badge>
                  </TableCell>
                  <TableCell 
                    className={`cursor-pointer ${copiedText === exec.numero_de_processo && copiedId === exec.id ? 'bg-blue-50' : ''}`}
                    onDoubleClick={() => copyToClipboard(exec.numero_de_processo, exec.id)}
                  >
                    {exec.numero_de_processo || '---'}
                  </TableCell>
                  <TableCell 
                    className={`cursor-pointer ${copiedText === exec.nome_do_documento && copiedId === exec.id ? 'bg-blue-50' : ''}`}
                    onDoubleClick={() => copyToClipboard(exec.nome_do_documento, exec.id)}
                  >
                    {exec.nome_do_documento ? exec.nome_do_documento.split('_').join(' ') : '---'}
                  </TableCell>
                  <TableCell 
                    className={`cursor-pointer ${copiedText === exec.tipo_do_documento && copiedId === exec.id ? 'bg-blue-50' : ''}`}
                    onDoubleClick={() => copyToClipboard(exec.tipo_do_documento, exec.id)}
                  >
                    {exec.tipo_do_documento || '---'}
                  </TableCell>
                  <TableCell 
                    className={`cursor-pointer ${copiedText === exec.caminho_do_documento && copiedId === exec.id ? 'bg-blue-50' : ''}`}
                    onDoubleClick={() => copyToClipboard(exec.caminho_do_documento, exec.id)}
                  >
                    {exec.caminho_do_documento || '---'}
                  </TableCell>
                  <TableCell 
                    className={`cursor-pointer ${copiedText === exec.pasta_max && copiedId === exec.id ? 'bg-blue-50' : ''}`}
                    onClick={() => goToMaxFolder(exec.pasta_max)}
                    onDoubleClick={() => copyToClipboard(exec.pasta_max, exec.id)}
                  >
                    {exec.pasta_max || '---'}
                  </TableCell>
                  <TableCell>
                    {exec.tempo_de_execucao || '---'}
                  </TableCell>
                  <TableCell>
                    {formatDate(exec.data_cadastrado)}
                  </TableCell>
                  <TableCell>
                    {formatDate(exec.data_inicio_exec)}
                  </TableCell>
                  <TableCell>
                    {formatDate(exec.data_fim_exec)}
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
