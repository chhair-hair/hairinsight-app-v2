'use client';

import { useState } from 'react';
import { Bell, Send, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { NotificationManager } from '@/components/NotificationManager';
import { toast } from 'sonner';

export default function TestNotificationsPage() {
  const [token, setToken] = useState('');
  const [title, setTitle] = useState('Hora da rotina capilar! 💆‍♀️');
  const [body, setBody] = useState('Não esqueça de aplicar seu produto hoje');
  const [isLoading, setIsLoading] = useState(false);

  const sendTestNotification = async () => {
    if (!token.trim()) {
      toast.error('Token FCM é obrigatório');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token.trim(),
          title,
          body,
          data: {
            url: '/app',
          },
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Notificação enviada com sucesso!', {
          description: `Message ID: ${result.messageId}`,
        });
      } else {
        toast.error('Erro ao enviar notificação', {
          description: result.error,
        });
      }
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao enviar notificação');
    } finally {
      setIsLoading(false);
    }
  };

  const sendBroadcastNotification = async () => {
    setIsLoading(true);
    try {
      // Busca todos os tokens ativos
      const tokensResponse = await fetch('/api/register-fcm-token', {
        method: 'GET',
      });

      const tokensData = await tokensResponse.json();

      if (!tokensData.tokens || tokensData.tokens.length === 0) {
        toast.error('Nenhum token FCM registrado');
        return;
      }

      const tokens = tokensData.tokens.map((t: any) => t.fcm_token);

      // Envia notificação em massa
      const response = await fetch('/api/send-notification', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tokens,
          title,
          body,
          data: {
            url: '/app',
          },
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(`${result.successCount} notificações enviadas!`, {
          description: `${result.failureCount} falharam`,
        });
      } else {
        toast.error('Erro ao enviar notificações', {
          description: result.error,
        });
      }
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao enviar notificações em massa');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 pb-6 border-b">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Bell className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Teste de Notificações Push</h1>
          <p className="text-muted-foreground">
            Firebase Cloud Messaging - HTTP v1
          </p>
        </div>

        {/* Gerenciador de Notificações */}
        <NotificationManager />

        {/* Formulário de Teste */}
        <div className="space-y-4 p-6 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Send className="w-5 h-5" />
            Enviar Notificação de Teste
          </h2>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Token FCM
              </label>
              <Textarea
                placeholder="Cole o token FCM aqui..."
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="min-h-[100px] font-mono text-xs"
              />
              <p className="text-xs text-muted-foreground mt-1">
                O token será exibido acima quando você ativar as notificações
              </p>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Título
              </label>
              <Input
                placeholder="Título da notificação"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Mensagem
              </label>
              <Textarea
                placeholder="Corpo da notificação"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="min-h-[80px]"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                onClick={sendTestNotification}
                disabled={isLoading || !token.trim()}
                className="flex-1"
              >
                <Send className="w-4 h-4 mr-2" />
                Enviar Teste
              </Button>

              <Button
                onClick={sendBroadcastNotification}
                disabled={isLoading}
                variant="outline"
                className="flex-1"
              >
                <Users className="w-4 h-4 mr-2" />
                Enviar para Todos
              </Button>
            </div>
          </div>
        </div>

        {/* Informações */}
        <div className="p-4 border rounded-lg bg-muted/50 space-y-2 text-sm">
          <h3 className="font-semibold">Como usar:</h3>
          <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
            <li>Clique em "Ativar Notificações" acima</li>
            <li>Permita as notificações quando o navegador solicitar</li>
            <li>Copie o token FCM que será exibido</li>
            <li>Cole o token no campo "Token FCM"</li>
            <li>Personalize o título e mensagem</li>
            <li>Clique em "Enviar Teste"</li>
          </ol>
        </div>

        {/* Links úteis */}
        <div className="p-4 border rounded-lg bg-card space-y-3">
          <h3 className="font-semibold">Documentação</h3>
          <div className="space-y-2 text-sm">
            <a
              href="/FIREBASE_PUSH_SETUP.md"
              target="_blank"
              className="block text-primary hover:underline"
            >
              📄 Guia completo de configuração
            </a>
            <p className="text-muted-foreground">
              Veja o arquivo FIREBASE_PUSH_SETUP.md para instruções detalhadas
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
