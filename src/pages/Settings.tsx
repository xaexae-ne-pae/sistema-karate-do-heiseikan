
import React from 'react';
import { Sidebar } from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon, User, Shield, Bell, Lock } from "lucide-react";

const Settings = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b bg-background/95 px-8 py-4 backdrop-blur">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Configurações</h1>
            <p className="text-muted-foreground">Personalize sua experiência e configure preferências do sistema</p>
          </div>
        </header>
        
        <main className="px-8 py-6">
          <Card className="p-6">
            <Tabs defaultValue="account">
              <TabsList className="mb-6">
                <TabsTrigger value="account" className="gap-2">
                  <User className="h-4 w-4" />
                  <span>Conta</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="gap-2">
                  <Lock className="h-4 w-4" />
                  <span>Segurança</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="gap-2">
                  <Bell className="h-4 w-4" />
                  <span>Notificações</span>
                </TabsTrigger>
                <TabsTrigger value="system" className="gap-2">
                  <SettingsIcon className="h-4 w-4" />
                  <span>Sistema</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="account" className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium mb-4">Informações da Conta</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nome</label>
                      <input type="text" className="w-full p-2 border rounded-md" defaultValue="Administrador" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <input type="email" className="w-full p-2 border rounded-md" defaultValue="admin@karate-dojo.com" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Cargo</label>
                      <input type="text" className="w-full p-2 border rounded-md" defaultValue="Administrador" disabled />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Academia</label>
                      <input type="text" className="w-full p-2 border rounded-md" defaultValue="DÓ-HEISEIKAN" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button className="mr-2">Cancelar</Button>
                  <Button variant="default">Salvar Alterações</Button>
                </div>
              </TabsContent>
              
              <TabsContent value="security" className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium mb-4">Segurança</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Senha Atual</label>
                      <input type="password" className="w-full p-2 border rounded-md" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nova Senha</label>
                      <input type="password" className="w-full p-2 border rounded-md" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Confirmar Nova Senha</label>
                      <input type="password" className="w-full p-2 border rounded-md" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button variant="default">Atualizar Senha</Button>
                </div>
              </TabsContent>
              
              <TabsContent value="notifications" className="space-y-6">
                <h3 className="text-xl font-medium mb-4">Preferências de Notificação</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Notificações por Email</p>
                      <p className="text-sm text-muted-foreground">Receba atualizações sobre eventos por email</p>
                    </div>
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300"
                        defaultChecked
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Alertas do Sistema</p>
                      <p className="text-sm text-muted-foreground">Notificações dentro do aplicativo</p>
                    </div>
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300"
                        defaultChecked
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Notificações de Luta</p>
                      <p className="text-sm text-muted-foreground">Alertas para início de lutas e resultados</p>
                    </div>
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300"
                        defaultChecked
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="system" className="space-y-6">
                <h3 className="text-xl font-medium mb-4">Configurações do Sistema</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Tema Escuro</p>
                      <p className="text-sm text-muted-foreground">Altere a aparência do sistema</p>
                    </div>
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Modo Compacto</p>
                      <p className="text-sm text-muted-foreground">Reduz o espaçamento na interface</p>
                    </div>
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Settings;
