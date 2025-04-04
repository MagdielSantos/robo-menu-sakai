
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatusCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  status?: 'active' | 'inactive' | 'error' | 'processing';
  change?: string;
  changeType?: 'increase' | 'decrease';
}

const StatusCard: React.FC<StatusCardProps> = ({
  title,
  value,
  icon,
  status,
  change,
  changeType
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'active': return 'text-rpa-active';
      case 'inactive': return 'text-rpa-inactive';
      case 'error': return 'text-rpa-error';
      case 'processing': return 'text-rpa-processing';
      default: return '';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={cn("p-2 rounded-full bg-muted", getStatusColor())}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className={cn(
            "text-xs",
            changeType === 'increase' ? 'text-rpa-active' : 'text-rpa-error'
          )}>
            {changeType === 'increase' ? '↑' : '↓'} {change} desde ontem
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatusCard;
