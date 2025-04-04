
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Robot, 
  PlayCircle, 
  ActivitySquare, 
  Shield, 
  ChevronDown, 
  ChevronRight, 
  Menu, 
  X 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type MenuItem = {
  title: string;
  path: string;
  icon: React.ElementType;
  children?: MenuItem[];
};

const menuItems: MenuItem[] = [
  { title: 'Dashboard', path: '/', icon: Home },
  { title: 'Meus RPAs', path: '/rpas', icon: Robot },
  { 
    title: 'Execuções', 
    path: '/execucoes', 
    icon: PlayCircle,
    children: [
      { title: 'Histórico', path: '/execucoes/historico', icon: PlayCircle },
      { title: 'Agendamentos', path: '/execucoes/agendamentos', icon: PlayCircle }
    ]
  },
  { title: 'Monitoramento', path: '/monitoramento', icon: ActivitySquare },
  { title: 'Administração', path: '/admin', icon: Shield }
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const location = useLocation();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const toggleExpand = (title: string) => {
    if (expandedItems.includes(title)) {
      setExpandedItems(expandedItems.filter(item => item !== title));
    } else {
      setExpandedItems([...expandedItems, title]);
    }
  };

  const renderMenuItem = (item: MenuItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.title);
    const isActive = location.pathname === item.path;
    const Icon = item.icon;

    return (
      <div key={item.path} className="w-full">
        <div 
          className={cn(
            "flex items-center px-4 py-2 my-1 rounded-md transition-all",
            isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent/50",
            collapsed ? "justify-center" : "justify-between"
          )}
        >
          <Link 
            to={item.path} 
            className={cn(
              "flex items-center gap-3 flex-1",
              collapsed ? "justify-center" : ""
            )}
            onClick={hasChildren ? (e) => e.preventDefault() : undefined}
          >
            <Icon className="h-5 w-5" />
            {!collapsed && <span>{item.title}</span>}
          </Link>
          
          {hasChildren && !collapsed && (
            <button onClick={() => toggleExpand(item.title)}>
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          )}
        </div>

        {hasChildren && isExpanded && !collapsed && (
          <div className="pl-4 ml-4 border-l border-sidebar-border">
            {item.children?.map(child => renderMenuItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside 
      className={cn(
        "h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="py-4 px-4 border-b border-sidebar-border flex items-center justify-between">
        {!collapsed && <h1 className="text-xl font-bold text-rpa-primary">RoboMenu</h1>}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleCollapsed}
          className="ml-auto"
        >
          {collapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        {menuItems.map(item => renderMenuItem(item))}
      </div>

      <div className="p-4 border-t border-sidebar-border">
        {!collapsed && (
          <div className="text-xs text-muted-foreground">
            RoboMenu v1.0.0
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
