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
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Trash2
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { rpaService, RPAFiltro, RPAExecution, StatusCount } from '@/services/RPAService';
import FilterableColumnHeader from '@/components/Table/FilterableColumnHeader'; 

interface ExtendedRPA extends RPA {
  statusCount?: StatusCount;
  executions?: RPAExecution[];
}

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
  const [confirmExportDialogOpen, setConfirmExportDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filtro, setFiltro] = useState(new RPAFiltro());
  const [dados, setDados] = useState<RPAExecution[]>([]);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [pagina, setPagina] = useState(0);
  const [itensPorPagina, setItensPorPagina] = useState(10);
  const [carregandoPaginacao, setCarregandoPaginacao] = useState(false);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<{[key: string]: {matchMode: string; value: string}}>({});
  const [activeDateRange, setActiveDateRange] = useState<{startDate: string | null; endDate: string | null}>({
    startDate: null,
    endDate: null
  });
  const [sortField, setSortField] = useState('');

  const fetchRPAData = async () => {
    setLoading(true);
    try {
      if (!id) {
        toast.error("ID do RPA não fornecido");
        setLoading(false);
        return;
      }
      
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
      
      const statusCount = await rpaService.getStatusCount();
      
      setRpa(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          statusCount: {
            ignorado: statusCount.ignorado,
            pendente: statusCount.pendente,
            iniciado: statusCount.iniciado,
            sucesso: statusCount.sucesso,
            erro: statusCount.erro,
            total: statusCount.total
          }
        };
      });
      
      await fetchExecutions();
    } catch (error) {
      console.error("Error fetching RPA data:", error);
      toast.error("Erro ao carregar dados do RPA");
    } finally {
      setLoading(false);
    }
  };
  
  const fetchExecutions = async () => {
    setCarregandoPaginacao(true);
    try {
      let updatedFiltro = { ...filtro };
      updatedFiltro.skip = pagina * itensPorPagina;
      updatedFiltro.itensPorPagina = itensPorPagina;
      
      if (filterStatus) {
        updatedFiltro.status_proc = filterStatus;
      }
      
      const { datas: executions, total } = await rpaService.pesquisar(updatedFiltro);
      
      setDados(executions);
      setTotalRegistros(total);
      
      setRpa(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          executions
        };
      });
    } catch (error) {
      console.error("Error fetching executions:", error);
      toast.error("Erro ao carregar execuções");
    } finally {
      setCarregandoPaginacao(false);
    }
  };
  
  useEffect(() => {
    fetchRPAData();
    
    const interval = setInterval(() => {
      rpaService.getStatusCount()
        .then(statusCount => {
          setRpa(prev => {
            if (!prev) return prev;
            return {
              ...prev,
              statusCount: {
                ignorado: statusCount.ignorado,
                pendente: statusCount.pendente,
                iniciado: statusCount.iniciado,
                sucesso: statusCount.sucesso,
                erro: statusCount.erro,
                total: statusCount.total
              }
            };
          });
        })
        .catch(error => console.error("Error refreshing status counts:", error));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [id]);
  
  useEffect(() => {
    if (!loading) {
      fetchExecutions();
    }
  }, [pagina, itensPorPagina, filterStatus, filtro]);

  const handleExecute = () => {
    toast.success(`Iniciando execução: ${rpa?.name}`);
  };

  const handleReportIncident = () => {
    window.open(
      'https://dev.azure.com/ernestoborgesms/SOLICITAR%20PROJETO%20OU%20INCIDENTE/SOLICITAR%20PROJETO%20OU%20INCIDENTE%20Team/_workitems/create/registrar%20incidentes%20ou%20solicita%C3%A7%C3%A3o',
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

  const exportToExcel = async () => {
    setConfirmExportDialogOpen(false);
    toast.success('Exportando dados para Excel...');
    try {
      await rpaService.exportExcel(filtro);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
    }
  };

  const handleDeleteConfirm = (id: string) => {
    setSelectedRecordId(id);
    setConfirmDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (selectedRecordId) {
      try {
        await rpaService.deletar(selectedRecordId);
        fetchExecutions(); // Refresh the data
      } catch (error) {
        console.error("Error deleting record:", error);
      }
    }
    setConfirmDeleteDialogOpen(false);
    setSelectedRecordId(null);
  };

  const handleApplyFilter = (field: string, filter: { matchMode: string; value: string } | null) => {
    // Update active filters state
    if (filter && filter.value) {
      setActiveFilters(prev => ({
        ...prev,
        [field]: filter
      }));
    } else {
      const newFilters = { ...activeFilters };
      delete newFilters[field];
      setActiveFilters(newFilters);
    }
    
    // Apply filter to the service
    const newFiltro = rpaService.applyFilter(filtro, field, filter);
    setFiltro(newFiltro);
    setPagina(0); // Reset to first page
  };

  const handleDateRangeFilter = (field: string, dateRange: { startDate: string | null; endDate: string | null }) => {
    // Update active date range state
    setActiveDateRange(dateRange);
    
    // Apply date range to the filtro
    const newFiltro = { ...filtro };
    
    if (dateRange.startDate) {
      newFiltro.data_inicial = dateRange.startDate;
    } else {
      newFiltro.data_inicial = undefined;
    }
    
    if (dateRange.endDate) {
      newFiltro.data_final = dateRange.endDate;
    } else {
      newFiltro.data_final = undefined;
    }
    
    setFiltro(newFiltro);
    setPagina(0); // Reset to first page
  };

  const handleSort = (field: string) => {
    setSortField(field);
    const newFiltro = rpaService.updateSort(filtro, field);
    setFiltro(newFiltro);
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

  const totalPages = Math.ceil(totalRegistros / itensPorPagina);
  
  const goToFirstPage = () => {
    setPagina(0);
  };
  
  const goToPreviousPage = () => {
    if (pagina > 0) {
      setPagina(pagina - 1);
    }
  };
  
  const goToNextPage = () => {
    if (pagina < totalPages - 1) {
      setPagina(pagina + 1);
    }
  };
  
  const goToLastPage = () => {
    setPagina(totalPages - 1);
  };
  
  const handlePerPageChange = (value: string) => {
    setItensPorPagina(parseInt(value));
    setPagina(0);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setCopiedId(id);
    toast.success("Copiado para a área de transferência!");
    
    setTimeout(() => {
      setCopiedText(null);
      setCopiedId(null);
    }, 2000);
  };

  const handleStatusCardClick = (status: string | null) => {
    setFilterStatus(status);
    
    // If status is not null, add it as a filter
    if (status) {
      handleApplyFilter('status', { matchMode: 'equals', value: status });
    } else {
      handleApplyFilter('status', null);
    }
  };

  const handleClearAllFilters = () => {
    setActiveFilters({});
    setActiveDateRange({ startDate: null, endDate: null });
    setFiltro(new RPAFiltro());
    setFilterStatus(null);
    setPagina(0);
  };

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
          <Button variant="outline" onClick={() => setConfirmExportDialogOpen(true)}>
            <FileText className="h-4 w-4 mr-2" />
            Exportar Excel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 gap-4">
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleStatusCardClick('IGNORADO')}
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
          onClick={() => handleStatusCardClick('PENDENTE')}
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
          onClick={() => handleStatusCardClick('INICIADO')}
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
          onClick={() => handleStatusCardClick('CONCLUÍDO')}
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
          onClick={() => handleStatusCardClick('ERRO')}
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
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleStatusCardClick(null)}
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
          {(Object.keys(activeFilters).length > 0 || activeDateRange.startDate || activeDateRange.endDate) && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClearAllFilters}
            >
              Limpar filtros
            </Button>
          )}
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <FilterableColumnHeader
                  title="Status"
                  field="status"
                  onSort={handleSort}
                  onFilter={handleApplyFilter}
                  currentFilter={activeFilters.status}
                  isSorted={sortField === 'status'}
                />
              </TableHead>
              <TableHead>
                <FilterableColumnHeader
                  title="Número de processo"
                  field="processNumber"
                  onSort={handleSort}
                  onFilter={handleApplyFilter}
                  currentFilter={activeFilters.processNumber}
                  isSorted={sortField === 'processNumber'}
                />
              </TableHead>
              <TableHead>
                <FilterableColumnHeader
                  title="Nome do documento"
                  field="documentName"
                  onSort={handleSort}
                  onFilter={handleApplyFilter}
                  currentFilter={activeFilters.documentName}
                  isSorted={sortField === 'documentName'}
                />
              </TableHead>
              <TableHead>
                <FilterableColumnHeader
                  title="Tipo do documento"
                  field="documentType"
                  onSort={handleSort}
                  onFilter={handleApplyFilter}
                  currentFilter={activeFilters.documentType}
                  isSorted={sortField === 'documentType'}
                />
              </TableHead>
              <TableHead>
                <FilterableColumnHeader
                  title="Caminho do documento"
                  field="documentPath"
                  onSort={handleSort}
                  onFilter={handleApplyFilter}
                  currentFilter={activeFilters.documentPath}
                  isSorted={sortField === 'documentPath'}
                />
              </TableHead>
              <TableHead>
                <FilterableColumnHeader
                  title="Pasta Max"
                  field="maxFolder"
                  onSort={handleSort}
                  onFilter={handleApplyFilter}
                  currentFilter={activeFilters.maxFolder}
                  isSorted={sortField === 'maxFolder'}
                />
              </TableHead>
              <TableHead>
                <div className="flex items-center space-x-1">
                  <div className="flex-1 whitespace-nowrap">Tempo de Execução</div>
                </div>
              </TableHead>
              <TableHead>
                <FilterableColumnHeader
                  title="Data cadastrado"
                  field="registrationDate"
                  onSort={handleSort}
                  onDateRangeFilter={handleDateRangeFilter}
                  currentDateRange={activeDateRange}
                  isSorted={sortField === 'registrationDate'}
                  isDateFilter={true}
                />
              </TableHead>
              <TableHead>
                <FilterableColumnHeader
                  title="Data Início Execução"
                  field="startDate"
                  onSort={handleSort}
                  isSorted={sortField === 'startDate'}
                />
              </TableHead>
              <TableHead>
                <FilterableColumnHeader
                  title="Data Fim Execução"
                  field="endDate"
                  onSort={handleSort}
                  isSorted={sortField === 'endDate'}
                />
              </TableHead>
              <TableHead className="w-10">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {carregandoPaginacao ? (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-6">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : dados && dados.length > 0 ? (
              dados.map((exec) => ( 
                <TableRow key={exec.id}>
                  <TableCell
                    className={`cursor-pointer ${copiedText === exec.status && copiedId === exec.id ? 'bg-blue-50' : ''}`}
                    onClick={() => copyToClipboard(exec.status, exec.id)}
                  >
                    <Badge className={getStatusVariant(exec.status)} variant="outline">
                      {getStatusIcon(exec.status)}
                      <span className="ml-1">{exec.status}</span>
                    </Badge>
                  </TableCell>
                  <TableCell
                    className={`cursor-pointer ${copiedText === exec.processNumber && copiedId === exec.id ? 'bg-blue-50' : ''}`}
                    onClick={() => copyToClipboard(exec.processNumber, exec.id)}
                  >
                    {exec.processNumber || '---'}
                  </TableCell>
                  <TableCell
                    className={`cursor-pointer ${copiedText === exec.documentName && copiedId === exec.id ? 'bg-blue-50' : ''}`}
                    onClick={() => copyToClipboard(exec.documentName, exec.id)}
                  >
                    {exec.documentName ? exec.documentName.split('_').join(' ') : '---'}
                  </TableCell>
                  <TableCell
                    className={`cursor-pointer ${copiedText === exec.documentType && copiedId === exec.id ? 'bg-blue-50' : ''}`}
                    onClick={() => copyToClipboard(exec.documentType, exec.id)}
                  >
                    {exec.documentType || '---'}
                  </TableCell>
                  <TableCell
                    className={`cursor-pointer ${copiedText === exec.documentPath && copiedId === exec.id ? 'bg-blue-50' : ''}`}
                    onClick={() => copyToClipboard(exec.documentPath, exec.id)}
                  >
                    {exec.documentPath || '---'}
                  </TableCell>
                  <TableCell
                    className={`cursor-pointer ${copiedText === exec.maxFolder && copiedId === exec.id ? 'bg-blue-50' : ''}`}
                    onClick={() => goToMaxFolder(exec.maxFolder)}
                  >
                    {exec.maxFolder || '---'}
                  </TableCell>
                  <TableCell>{exec.executionTime || '---'}</TableCell>
                  <TableCell>{formatDate(exec.registrationDate)}</TableCell>
                  <TableCell>{formatDate(exec.startDate)}</TableCell>
                  <TableCell>{formatDate(exec.endDate)}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteConfirm(exec.id)}
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-6">
                  Nenhum registro encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        <div className="flex items-center justify-between px-4 py-3 border-t">
          <div className="flex items-center">
            <span className="text-sm text-gray-700 mr-2">Itens por página:</span>
            <Select value={itensPorPagina.toString()} onValueChange={handlePerPageChange}>
              <SelectTrigger className="w-16 h-8">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            
            <span className="ml-4 text-sm text-gray-700">
              Mostrando {pagina * itensPorPagina + 1} - {Math.min((pagina + 1) * itensPorPagina, totalRegistros)} de {totalRegistros}
            </span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="icon"
              onClick={goToFirstPage}
              disabled={pagina === 0 || carregandoPaginacao}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={goToPreviousPage}
              disabled={pagina === 0 || carregandoPaginacao}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="px-3 py-1 rounded bg-gray-100 text-gray-800">
              {pagina + 1} / {totalPages || 1}
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={goToNextPage}
              disabled={pagina >= totalPages - 1 || carregandoPaginacao}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={goToLastPage}
              disabled={pagina >= totalPages - 1 || carregandoPaginacao}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

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

      <Dialog open={confirmDeleteDialogOpen} onOpenChange={setConfirmDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza de que deseja excluir este registro? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-1" />
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default RPADetailPage;