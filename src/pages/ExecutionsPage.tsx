
import React from 'react';
import { Calendar, ChevronDown, Clock, List, RefreshCcw } from 'lucide-react';
import Header from '@/components/Layout/Header';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

const mockExecutions = [
  {
    id: '1',
    rpaName: 'Processamento de Faturas',
    startTime: '04/04/2025 14:30',
    endTime: '04/04/2025 14:35',
    status: 'success',
    duration: '5 min',
    executedBy: 'Sistema',
  },
  {
    id: '2',
    rpaName: 'Web Scraping de Preços',
    startTime: '04/04/2025 10:15',
    endTime: '04/04/2025 10:20',
    status: 'error',
    duration: '5 min',
    executedBy: 'João Silva',
  },
  {
    id: '3',
    rpaName: 'Geração de Relatórios',
    startTime: '04/04/2025 09:00',
    endTime: '04/04/2025 09:15',
    status: 'success',
    duration: '15 min',
    executedBy: 'Sistema',
  },
  {
    id: '4',
    rpaName: 'Monitoramento de Sistemas',
    startTime: '04/04/2025 08:00',
    endTime: 'Em andamento',
    status: 'running',
    duration: '--',
    executedBy: 'Sistema',
  },
  {
    id: '5',
    rpaName: 'Integração de Cadastros',
    startTime: '03/04/2025 16:45',
    endTime: '03/04/2025 16:50',
    status: 'warning',
    duration: '5 min',
    executedBy: 'Maria Souza',
  }
];

const mockSchedules = [
  {
    id: '1',
    rpaName: 'Processamento de Faturas',
    schedule: 'Diário - 14:00',
    nextExecution: '05/04/2025 14:00',
    status: 'active',
    createdBy: 'Sistema',
  },
  {
    id: '2',
    rpaName: 'Web Scraping de Preços',
    schedule: 'Seg-Sex - 09:00',
    nextExecution: '05/04/2025 09:00',
    status: 'inactive',
    createdBy: 'João Silva',
  },
  {
    id: '3',
    rpaName: 'Geração de Relatórios',
    schedule: 'Mensal - Dia 1 às 08:00',
    nextExecution: '01/05/2025 08:00',
    status: 'active',
    createdBy: 'Sistema',
  }
];

const ExecutionsPage: React.FC = () => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-rpa-active">Sucesso</Badge>;
      case 'error':
        return <Badge className="bg-rpa-error">Erro</Badge>;
      case 'running':
        return <Badge className="bg-rpa-processing animate-pulse-slow">Em Execução</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500">Alerta</Badge>;
      case 'active':
        return <Badge className="bg-rpa-active">Ativo</Badge>;
      case 'inactive':
        return <Badge className="bg-rpa-inactive">Inativo</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Header pageTitle="Execuções" />
      
      <Tabs defaultValue="history">
        <TabsList>
          <TabsTrigger value="history">
            <List className="h-4 w-4 mr-2" />
            Histórico
          </TabsTrigger>
          <TabsTrigger value="schedules">
            <Calendar className="h-4 w-4 mr-2" />
            Agendamentos
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="history" className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Clock className="h-4 w-4 mr-2" />
                Últimas 24 horas
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
              <Button variant="outline" size="sm">
                Filtrar
              </Button>
            </div>
            <Button size="sm" variant="ghost">
              <RefreshCcw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </div>
          
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>RPA</TableHead>
                  <TableHead>Início</TableHead>
                  <TableHead>Término</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Duração</TableHead>
                  <TableHead>Executado por</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockExecutions.map((execution) => (
                  <TableRow key={execution.id}>
                    <TableCell className="font-medium">{execution.rpaName}</TableCell>
                    <TableCell>{execution.startTime}</TableCell>
                    <TableCell>{execution.endTime}</TableCell>
                    <TableCell>{getStatusBadge(execution.status)}</TableCell>
                    <TableCell>{execution.duration}</TableCell>
                    <TableCell>{execution.executedBy}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="schedules" className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <Button variant="outline" size="sm">
              Filtrar
            </Button>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Novo Agendamento
            </Button>
          </div>
          
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>RPA</TableHead>
                  <TableHead>Agendamento</TableHead>
                  <TableHead>Próxima Execução</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Criado por</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockSchedules.map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell className="font-medium">{schedule.rpaName}</TableCell>
                    <TableCell>{schedule.schedule}</TableCell>
                    <TableCell>{schedule.nextExecution}</TableCell>
                    <TableCell>{getStatusBadge(schedule.status)}</TableCell>
                    <TableCell>{schedule.createdBy}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Editar</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExecutionsPage;
