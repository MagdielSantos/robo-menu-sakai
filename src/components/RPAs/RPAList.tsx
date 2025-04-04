
import React, { useState } from 'react';
import { Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import RPACard, { RPA } from './RPACard';

const mockRPAs: RPA[] = [
  {
    id: "1",
    name: "Processamento de Faturas",
    description: "Automatização do processo de captura e classificação de faturas recebidas por email.",
    status: "active",
    category: "Financeiro",
    lastExecution: "Hoje, 14:30",
    favorite: true
  },
  {
    id: "2",
    name: "Web Scraping de Preços",
    description: "Coleta automática de preços de produtos de sites concorrentes para análise comparativa.",
    status: "error",
    category: "Marketing",
    lastExecution: "Hoje, 10:15",
    favorite: false
  },
  {
    id: "3",
    name: "Integração de Cadastros",
    description: "Sincronização de dados cadastrais entre o CRM e o sistema ERP.",
    status: "inactive",
    category: "Operações",
    lastExecution: "Ontem, 16:45",
    favorite: true
  },
  {
    id: "4",
    name: "Geração de Relatórios",
    description: "Criação automatizada de relatórios consolidados de vendas mensais.",
    status: "processing",
    category: "Vendas",
    lastExecution: "Em andamento",
    favorite: false
  },
  {
    id: "5",
    name: "Monitoramento de Sistemas",
    description: "Verificação periódica do status dos servidores e aplicações críticas.",
    status: "active",
    category: "TI",
    lastExecution: "Hoje, 15:00",
    favorite: false
  },
  {
    id: "6",
    name: "Gestão de Férias",
    description: "Processamento automático de solicitações de férias dos colaboradores.",
    status: "active",
    category: "RH",
    lastExecution: "Ontem, 09:20",
    favorite: true
  }
];

const categories = ["Todos", "Financeiro", "Marketing", "Operações", "Vendas", "TI", "RH"];
const statusOptions = ["Todos", "Ativo", "Inativo", "Erro", "Em Processamento"];

const RPAList: React.FC = () => {
  const [rpas, setRpas] = useState<RPA[]>(mockRPAs);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [selectedStatus, setSelectedStatus] = useState<string>("Todos");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);

  const handleToggleFavorite = (id: string) => {
    setRpas(prev => prev.map(rpa => 
      rpa.id === id ? { ...rpa, favorite: !rpa.favorite } : rpa
    ));
  };

  const handleExecute = (id: string) => {
    const rpa = rpas.find(r => r.id === id);
    if (rpa) {
      toast.success(`Iniciando execução: ${rpa.name}`);
      // Aqui você chamaria a API para iniciar a execução do RPA
    }
  };

  const filteredRPAs = rpas.filter(rpa => {
    // Filtro de busca
    const matchesSearch = rpa.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          rpa.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filtro de categoria
    const matchesCategory = selectedCategory === "Todos" || rpa.category === selectedCategory;
    
    // Filtro de status
    let matchesStatus = true;
    if (selectedStatus !== "Todos") {
      switch (selectedStatus) {
        case "Ativo": matchesStatus = rpa.status === "active"; break;
        case "Inativo": matchesStatus = rpa.status === "inactive"; break;
        case "Erro": matchesStatus = rpa.status === "error"; break;
        case "Em Processamento": matchesStatus = rpa.status === "processing"; break;
      }
    }
    
    // Filtro de favoritos
    const matchesFavorite = !showFavoritesOnly || rpa.favorite;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesFavorite;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar RPA..." 
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Select 
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select
            value={selectedStatus}
            onValueChange={setSelectedStatus}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(status => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            variant={showFavoritesOnly ? "default" : "outline"}
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          >
            Favoritos
          </Button>
          
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Mais Filtros
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRPAs.length > 0 ? (
          filteredRPAs.map(rpa => (
            <RPACard 
              key={rpa.id} 
              rpa={rpa} 
              onToggleFavorite={handleToggleFavorite}
              onExecute={handleExecute}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-muted-foreground">Nenhum RPA encontrado com os filtros aplicados.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RPAList;
