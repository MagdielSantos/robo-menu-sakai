
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Edit, MoreVertical, Play, Star } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type RPA = {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'error' | 'processing';
  category: string;
  lastExecution?: string;
  favorite: boolean;
};

interface RPACardProps {
  rpa: RPA;
  onToggleFavorite: (id: string) => void;
  onExecute: (id: string) => void;
}

const RPACard: React.FC<RPACardProps> = ({ rpa, onToggleFavorite, onExecute }) => {
  const getStatusColor = () => {
    switch (rpa.status) {
      case 'active': return 'bg-rpa-active';
      case 'inactive': return 'bg-rpa-inactive';
      case 'error': return 'bg-rpa-error';
      case 'processing': return 'bg-rpa-processing';
      default: return 'bg-rpa-inactive';
    }
  };

  const getStatusText = () => {
    switch (rpa.status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      case 'error': return 'Erro';
      case 'processing': return 'Em Processamento';
      default: return 'Desconhecido';
    }
  };

  const statusDot = (
    <span 
      className={cn(
        "h-2 w-2 rounded-full mr-2", 
        getStatusColor(),
        rpa.status === 'processing' && "animate-pulse-slow"
      )} 
    />
  );

  return (
    <Card className="overflow-hidden">
      <CardHeader className="relative p-4 pb-0">
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onToggleFavorite(rpa.id)}
          >
            <Star 
              className={cn(
                "h-4 w-4", 
                rpa.favorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
              )} 
            />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Editar</DropdownMenuItem>
              <DropdownMenuItem>Agendar</DropdownMenuItem>
              <DropdownMenuItem>Duplicar</DropdownMenuItem>
              <DropdownMenuItem className="text-rpa-error">Excluir</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardTitle className="text-lg">{rpa.name}</CardTitle>
        <Badge variant="outline" className="mt-2">{rpa.category}</Badge>
      </CardHeader>
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{rpa.description}</p>
        
        <div className="flex items-center mt-4">
          {statusDot}
          <span className="text-sm">{getStatusText()}</span>
        </div>

        {rpa.lastExecution && (
          <div className="flex items-center mt-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            <span>Última execução: {rpa.lastExecution}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-muted/50 p-4 flex justify-between">
        <Button asChild variant="outline" size="sm">
          <Link to={`/rpas/${rpa.id}`}>
            <Edit className="h-3 w-3 mr-1" />
            Detalhes
          </Link>
        </Button>
        <Button onClick={() => onExecute(rpa.id)} size="sm" variant="default">
          <Play className="h-3 w-3 mr-1" />
          Executar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RPACard;
