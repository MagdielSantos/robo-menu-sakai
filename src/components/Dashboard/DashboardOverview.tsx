
import React from 'react';
import { Activity, AlertTriangle, PlayCircle, Bot } from 'lucide-react';
import StatusCard from './StatusCard';
import ExecutionChart from './ExecutionChart';

const mockChartData = [
  { name: 'Segunda', success: 12, error: 2 },
  { name: 'Terça', success: 19, error: 1 },
  { name: 'Quarta', success: 15, error: 3 },
  { name: 'Quinta', success: 21, error: 0 },
  { name: 'Sexta', success: 16, error: 1 },
  { name: 'Sábado', success: 8, error: 0 },
  { name: 'Domingo', success: 5, error: 0 },
];

const DashboardOverview: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard 
          title="RPAs Ativos" 
          value={24} 
          icon={<Bot className="h-4 w-4" />} 
          status="active" 
          change="10%" 
          changeType="increase" 
        />
        <StatusCard 
          title="Execuções Hoje" 
          value={78} 
          icon={<PlayCircle className="h-4 w-4" />} 
          change="5%" 
          changeType="increase" 
        />
        <StatusCard 
          title="RPAs em Erro" 
          value={3} 
          icon={<AlertTriangle className="h-4 w-4" />} 
          status="error" 
        />
        <StatusCard 
          title="Taxa de Sucesso" 
          value="96%" 
          icon={<Activity className="h-4 w-4" />} 
          status="active" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ExecutionChart data={mockChartData} />
      </div>
    </div>
  );
};

export default DashboardOverview;
