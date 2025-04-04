
import React from 'react';
import { ArrowDown, ArrowRight, ArrowUp, CheckCircle2, Clock, RefreshCcw, XCircle } from 'lucide-react';
import Header from '@/components/Layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const mockPerformanceData = [
  { time: '08:00', cpu: 45, memory: 30, load: 25 },
  { time: '09:00', cpu: 50, memory: 35, load: 30 },
  { time: '10:00', cpu: 65, memory: 40, load: 45 },
  { time: '11:00', cpu: 80, memory: 55, load: 60 },
  { time: '12:00', cpu: 70, memory: 60, load: 50 },
  { time: '13:00', cpu: 65, memory: 55, load: 45 },
  { time: '14:00', cpu: 75, memory: 60, load: 55 },
  { time: '15:00', cpu: 85, memory: 70, load: 65 },
  { time: '16:00', cpu: 70, memory: 65, load: 50 },
];

const mockRPAStatus = [
  { id: '1', name: 'Processamento de Faturas', status: 'active', lastCheck: '4 min atrás', trend: 'stable' },
  { id: '2', name: 'Web Scraping de Preços', status: 'error', lastCheck: '2 min atrás', trend: 'down' },
  { id: '3', name: 'Integração de Cadastros', status: 'inactive', lastCheck: '10 min atrás', trend: 'stable' },
  { id: '4', name: 'Geração de Relatórios', status: 'processing', lastCheck: 'Agora', trend: 'up' },
  { id: '5', name: 'Monitoramento de Sistemas', status: 'active', lastCheck: '1 min atrás', trend: 'up' },
];

const MonitoringPage: React.FC = () => {
  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString();
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUp className="h-4 w-4 text-rpa-active" />;
      case 'down': return <ArrowDown className="h-4 w-4 text-rpa-error" />;
      case 'stable': return <ArrowRight className="h-4 w-4 text-muted-foreground" />;
      default: return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle2 className="h-4 w-4 text-rpa-active" />;
      case 'error': return <XCircle className="h-4 w-4 text-rpa-error" />;
      case 'processing': 
        return (
          <div className="h-4 w-4 rounded-full border-2 border-rpa-processing border-t-transparent animate-spin" />
        );
      default: return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <Header pageTitle="Monitoramento" />
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            Atualizado: {formatTime()}
          </span>
          <Button size="sm" variant="ghost">
            <RefreshCcw className="h-4 w-4 mr-1" />
            Atualizar
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="col-span-3 lg:col-span-2">
          <CardHeader>
            <CardTitle>Desempenho do Sistema</CardTitle>
            <CardDescription>Uso de recursos nas últimas 8 horas</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="cpu" stroke="#8884d8" name="CPU %" />
                <Line type="monotone" dataKey="memory" stroke="#82ca9d" name="Memória %" />
                <Line type="monotone" dataKey="load" stroke="#ffc658" name="Carga" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recursos do Sistema</CardTitle>
            <CardDescription>Status atual</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>CPU</span>
                <span>75%</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Memória</span>
                <span>60%</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Disco</span>
                <span>45%</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Rede</span>
                <span>30%</span>
              </div>
              <Progress value={30} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Status dos RPAs</CardTitle>
          <CardDescription>Monitoramento em tempo real</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 text-left">Nome</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Última verificação</th>
                  <th className="py-3 px-4 text-left">Tendência</th>
                  <th className="py-3 px-4 text-left">Ações</th>
                </tr>
              </thead>
              <tbody>
                {mockRPAStatus.map((rpa) => (
                  <tr key={rpa.id} className="border-b">
                    <td className="py-3 px-4">{rpa.name}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(rpa.status)}
                        <Badge 
                          className={
                            rpa.status === 'active' ? 'bg-rpa-active' : 
                            rpa.status === 'error' ? 'bg-rpa-error' :
                            rpa.status === 'processing' ? 'bg-rpa-processing' :
                            'bg-rpa-inactive'
                          }
                        >
                          {rpa.status === 'active' ? 'Ativo' : 
                           rpa.status === 'error' ? 'Erro' :
                           rpa.status === 'processing' ? 'Em Processamento' :
                           'Inativo'
                          }
                        </Badge>
                      </div>
                    </td>
                    <td className="py-3 px-4">{rpa.lastCheck}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        {getTrendIcon(rpa.trend)}
                        {rpa.trend === 'up' ? 'Melhorando' : 
                         rpa.trend === 'down' ? 'Deteriorando' : 
                         'Estável'
                        }
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Detalhes</Button>
                        <Button size="sm" variant="default">Reiniciar</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MonitoringPage;
