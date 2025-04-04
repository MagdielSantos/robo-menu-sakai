
import React from 'react';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ExecutionChartProps {
  data: {
    name: string;
    success: number;
    error: number;
  }[];
}

const ExecutionChart: React.FC<ExecutionChartProps> = ({ data }) => {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Execuções Recentes</CardTitle>
        <CardDescription>
          Número de execuções de RPAs nos últimos 7 dias
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="success" 
              stroke="#4CAF50" 
              activeDot={{ r: 8 }} 
              name="Sucesso" 
            />
            <Line 
              type="monotone" 
              dataKey="error" 
              stroke="#F44336" 
              name="Erro" 
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ExecutionChart;
