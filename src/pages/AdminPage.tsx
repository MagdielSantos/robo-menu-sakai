
import React from 'react';
import Header from '@/components/Layout/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlusCircle } from 'lucide-react';

const mockUsers = [
  { id: '1', name: 'João Silva', email: 'joao.silva@empresa.com', role: 'Administrador', status: 'active' },
  { id: '2', name: 'Maria Souza', email: 'maria.souza@empresa.com', role: 'Desenvolvedor', status: 'active' },
  { id: '3', name: 'Pedro Santos', email: 'pedro.santos@empresa.com', role: 'Operador', status: 'inactive' },
  { id: '4', name: 'Ana Oliveira', email: 'ana.oliveira@empresa.com', role: 'Visualizador', status: 'active' },
  { id: '5', name: 'Carlos Ferreira', email: 'carlos.ferreira@empresa.com', role: 'Desenvolvedor', status: 'active' },
];

const mockIntegrations = [
  { id: '1', name: 'Sistema ERP', type: 'API Rest', status: 'connected' },
  { id: '2', name: 'CRM', type: 'API Rest', status: 'connected' },
  { id: '3', name: 'Banco de Dados', type: 'JDBC', status: 'error' },
  { id: '4', name: 'Email Server', type: 'SMTP', status: 'connected' },
  { id: '5', name: 'Storage', type: 'FTP', status: 'disconnected' },
];

const AdminPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <Header pageTitle="Administração" />
      
      <Tabs defaultValue="users">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="integrations">Integrações</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Gerenciamento de Usuários</CardTitle>
                <CardDescription>Gerencie os usuários do sistema</CardDescription>
              </div>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Novo Usuário
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Perfil</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <Badge
                          className={user.status === 'active' ? 'bg-rpa-active' : 'bg-rpa-inactive'}
                        >
                          {user.status === 'active' ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">Editar</Button>
                          <Button size="sm" variant="outline" className="text-rpa-error border-rpa-error hover:bg-rpa-error/10">
                            Remover
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Integrações</CardTitle>
                <CardDescription>Gerencie as integrações com sistemas externos</CardDescription>
              </div>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Nova Integração
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockIntegrations.map((integration) => (
                    <TableRow key={integration.id}>
                      <TableCell className="font-medium">{integration.name}</TableCell>
                      <TableCell>{integration.type}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            integration.status === 'connected' ? 'bg-rpa-active' : 
                            integration.status === 'error' ? 'bg-rpa-error' :
                            'bg-rpa-inactive'
                          }
                        >
                          {integration.status === 'connected' ? 'Conectado' : 
                           integration.status === 'error' ? 'Erro' :
                           'Desconectado'
                          }
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">Configurar</Button>
                          <Button 
                            size="sm" 
                            variant="default"
                            disabled={integration.status === 'connected'}
                          >
                            {integration.status === 'connected' ? 'Conectado' : 'Conectar'}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Sistema</CardTitle>
              <CardDescription>Configure as opções do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Configurações Gerais</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm">Caminho dos Logs: <span className="font-mono bg-muted p-1 rounded">/var/log/robomenu</span></p>
                        <p className="text-sm">Retenção de Logs: <span className="font-semibold">30 dias</span></p>
                        <p className="text-sm">Idioma Padrão: <span className="font-semibold">Português</span></p>
                        <div className="flex justify-end">
                          <Button size="sm">Editar</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Notificações</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm">Email de Notificação: <span className="font-semibold">Ativado</span></p>
                        <p className="text-sm">Notificação no Sistema: <span className="font-semibold">Ativado</span></p>
                        <p className="text-sm">Alertas em Tempo Real: <span className="font-semibold">Ativado</span></p>
                        <div className="flex justify-end">
                          <Button size="sm">Editar</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Backups e Restauração</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm">Último backup: <span className="font-semibold">04/04/2025 01:00</span></p>
                      <div className="flex gap-2">
                        <Button>Fazer Backup Agora</Button>
                        <Button variant="outline">Restaurar Backup</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
