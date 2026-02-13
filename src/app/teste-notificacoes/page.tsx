'use client';

import { useState, useEffect } from 'react';
import { Bell, Send, Users, CheckCircle, XCircle, AlertCircle, Copy, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { NotificationManager } from '@/components/NotificationManager';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';

export default function TesteNotificacoesPage() {
  const [fcmToken, setFcmToken] = useState('');
  const [title, setTitle] = useState('🎉 Lembrete HairInsight');
  const [body, setBody] = useState('Hora da sua rotina capilar! Não esqueça de aplicar seus produtos.');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [totalTokens, setTotalTokens] = useState(0);
  const [testResults, setTestResults] = useState<any[]>([]);

  // Busca o token do localStorage
  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('fcm_token');
      if (token) {
        setFcmToken(token);
      }
    };

    checkToken();

    // Verifica a cada segundo se o token foi criado
    const interval = setInterval(checkToken, 1000);

    return () => clearInterval(interval);
  }, []);

  // Busca total de tokens registrados
  useEffect(() => {
    fetchTokensCount();
  }, []);

  const fetchTokensCount = async () => {
    try {
      const response = await fetch('/api/register-fcm-token', {
        method: 'GET',
      });

      const data = await response.json();
      if (data.success) {
        setTotalTokens(data.count || 0);
      }
    } catch (error) {
      console.error('Erro ao buscar tokens:', error);
    }
  };

  const copyToken = () => {
    if (fcmToken) {
      navigator.clipboard.writeText(fcmToken);
      toast.success('Token copiado!');
    }
  };

  const sendTestNotification = async () => {
    if (!fcmToken.trim()) {
      toast.error('Ative as notificações primeiro!', {
        description: 'Clique em "Ativar Notificações" acima',
      });
      return;
    }

    if (!title.trim() || !body.trim()) {
      toast.error('Preencha o título e a mensagem');
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch('/api/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: fcmToken.trim(),
          title,
          body,
          data: {
            url: '/app',
            timestamp: new Date().toISOString(),
          },
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Notificação enviada! 🎉', {
          description: 'Verifique se recebeu a notificação',
        });

        setTestResults((prev) => [
          {
            type: 'individual',
            success: true,
            timestamp: new Date().toISOString(),
            messageId: result.messageId,
          },
          ...prev,
        ]);
      } else {
        toast.error('Erro ao enviar', {
          description: result.error || result.details,
        });

        setTestResults((prev) => [
          {
            type: 'individual',
            success: false,
            timestamp: new Date().toISOString(),
            error: result.error,
          },
          ...prev,
        ]);
      }
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao enviar notificação', {
        description: 'Verifique o console para mais detalhes',
      });
    } finally {
      setIsSending(false);
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
        toast.error('Nenhum dispositivo registrado', {
          description: 'Ative as notificações em pelo menos um dispositivo',
        });
        return;
      }

      const tokens = tokensData.tokens.map((t: any) => t.fcm_token);

      toast.info(`Enviando para ${tokens.length} dispositivos...`);

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
            timestamp: new Date().toISOString(),
          },
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(`${result.successCount} notificações enviadas! 🚀`, {
          description: result.failureCount > 0 ? `${result.failureCount} falharam` : 'Todas enviadas com sucesso',
        });

        setTestResults((prev) => [
          {
            type: 'broadcast',
            success: true,
            timestamp: new Date().toISOString(),
            successCount: result.successCount,
            failureCount: result.failureCount,
            total: tokens.length,
          },
          ...prev,
        ]);

        fetchTokensCount();
      } else {
        toast.error('Erro ao enviar', {
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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-3 pb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <Bell className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Teste de Notificações Push
          </h1>
          <p className="text-muted-foreground text-lg">
            Firebase Cloud Messaging HTTP v1 API
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalTokens}</p>
                <p className="text-sm text-muted-foreground">Dispositivos ativos</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                {fcmToken ? (
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium">
                  {fcmToken ? 'Token obtido' : 'Sem token'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {fcmToken ? 'Pronto para enviar' : 'Ative as notificações'}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Send className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{testResults.length}</p>
                <p className="text-sm text-muted-foreground">Testes realizados</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Gerenciador de Notificações */}
        <Card className="p-6">
          <NotificationManager />
        </Card>

        {/* Token Display */}
        {fcmToken && (
          <Card className="p-6 bg-gradient-to-br from-blue-500/5 to-purple-500/5 border-blue-200/50">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <label className="text-sm font-semibold mb-2 block flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  Seu Token FCM
                </label>
                <div className="bg-background/50 rounded-lg p-3 font-mono text-xs break-all border">
                  {fcmToken}
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={copyToken}
                className="flex items-center gap-2 shrink-0"
              >
                <Copy className="w-4 h-4" />
                Copiar
              </Button>
            </div>
          </Card>
        )}

        {/* Formulário de Teste */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Send className="w-5 h-5" />
            Enviar Notificação de Teste
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Título da Notificação
              </label>
              <Input
                placeholder="Ex: Lembrete da rotina capilar"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-base"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Mensagem
              </label>
              <Textarea
                placeholder="Ex: Não esqueça de aplicar seus produtos hoje!"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="min-h-[100px] text-base"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                onClick={sendTestNotification}
                disabled={isSending || !fcmToken.trim()}
                className="flex-1 h-12"
                size="lg"
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Enviar para Mim
                  </>
                )}
              </Button>

              <Button
                onClick={sendBroadcastNotification}
                disabled={isLoading || totalTokens === 0}
                variant="outline"
                className="flex-1 h-12"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Users className="w-5 h-5 mr-2" />
                    Enviar para Todos ({totalTokens})
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Histórico de Testes */}
        {testResults.length > 0 && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Histórico de Testes</h2>
            <div className="space-y-3">
              {testResults.slice(0, 5).map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    result.success
                      ? 'bg-green-500/5 border-green-200/50'
                      : 'bg-red-500/5 border-red-200/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      {result.success ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {result.type === 'broadcast' ? 'Envio em Massa' : 'Envio Individual'}
                        </p>
                        {result.type === 'broadcast' ? (
                          <p className="text-sm text-muted-foreground mt-1">
                            {result.successCount} enviadas de {result.total}
                            {result.failureCount > 0 && ` (${result.failureCount} falharam)`}
                          </p>
                        ) : (
                          <p className="text-xs text-muted-foreground mt-1 font-mono">
                            {result.success
                              ? `ID: ${result.messageId?.substring(0, 30)}...`
                              : `Erro: ${result.error}`}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(result.timestamp).toLocaleTimeString('pt-BR')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Guia de Uso */}
        <Card className="p-6 bg-gradient-to-br from-orange-500/5 to-yellow-500/5 border-orange-200/50">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" />
            <div>
              <h3 className="font-semibold mb-3">Como testar:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Clique em "Ativar Notificações" e permita quando o navegador solicitar</li>
                <li>Aguarde o token FCM ser gerado (aparecerá automaticamente)</li>
                <li>Personalize o título e mensagem da notificação</li>
                <li>Clique em "Enviar para Mim" para testar</li>
                <li>Use "Enviar para Todos" para testar envio em massa</li>
                <li>Verifique se recebeu a notificação (pode aparecer minimizada)</li>
              </ol>
              <div className="mt-4 p-3 bg-background/50 rounded-lg border">
                <p className="text-xs text-muted-foreground">
                  <strong>Dica:</strong> Se não recebeu a notificação, verifique:
                  <br />• Permissões do navegador
                  <br />• Se o Service Worker está registrado
                  <br />• Console do navegador para erros
                  <br />• Se as variáveis de ambiente do Firebase estão configuradas
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
