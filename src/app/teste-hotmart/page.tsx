'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Loader2, Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export default function TesteHotmart() {
  const [webhookStatus, setWebhookStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [webhookMessage, setWebhookMessage] = useState('');

  const [testEmail, setTestEmail] = useState('');
  const [accessResult, setAccessResult] = useState<any>(null);
  const [isCheckingAccess, setIsCheckingAccess] = useState(false);

  const testWebhook = async () => {
    setWebhookStatus('loading');
    try {
      const response = await fetch('/api/webhook/hotmart');
      const data = await response.json();

      if (response.ok) {
        setWebhookStatus('success');
        setWebhookMessage(data.message || 'Webhook está ativo!');
        toast.success('Webhook está funcionando!');
      } else {
        setWebhookStatus('error');
        setWebhookMessage('Erro ao testar webhook');
        toast.error('Erro ao testar webhook');
      }
    } catch (error) {
      setWebhookStatus('error');
      setWebhookMessage('Erro de conexão');
      toast.error('Erro de conexão');
    }
  };

  const checkAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmail) return;

    setIsCheckingAccess(true);
    setAccessResult(null);

    try {
      const response = await fetch(`/api/check-access?email=${encodeURIComponent(testEmail)}`);
      const data = await response.json();

      setAccessResult(data);

      if (data.hasAccess) {
        toast.success('Usuário tem acesso!');
      } else {
        toast.error('Usuário não tem acesso');
      }
    } catch (error) {
      toast.error('Erro ao verificar acesso');
      setAccessResult({ error: 'Erro ao verificar' });
    } finally {
      setIsCheckingAccess(false);
    }
  };

  const copyWebhookUrl = () => {
    const url = `${window.location.origin}/api/webhook/hotmart`;
    navigator.clipboard.writeText(url);
    toast.success('URL copiada!');
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-background to-muted">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold">Teste do Sistema Hotmart</h1>
          <p className="text-muted-foreground">
            Verifique se tudo está configurado corretamente
          </p>
        </div>

        {/* Status do Webhook */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              1. Verificar Webhook
              {webhookStatus === 'success' && (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              )}
              {webhookStatus === 'error' && (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </CardTitle>
            <CardDescription>
              Testa se o endpoint do webhook está respondendo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={testWebhook}
              disabled={webhookStatus === 'loading'}
              className="w-full"
            >
              {webhookStatus === 'loading' && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Testar Webhook
            </Button>

            {webhookMessage && (
              <div className={`p-4 rounded-lg ${
                webhookStatus === 'success'
                  ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                  : 'bg-red-500/10 text-red-600 dark:text-red-400'
              }`}>
                {webhookMessage}
              </div>
            )}

            {webhookStatus === 'success' && (
              <div className="space-y-3 p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">URL do Webhook:</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyWebhookUrl}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar
                  </Button>
                </div>
                <code className="block text-xs bg-background p-3 rounded border overflow-x-auto">
                  {typeof window !== 'undefined' && `${window.location.origin}/api/webhook/hotmart`}
                </code>
                <p className="text-xs text-muted-foreground">
                  ⚠️ Use esta URL na configuração do webhook na Hotmart
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Verificar Acesso */}
        <Card>
          <CardHeader>
            <CardTitle>2. Verificar Acesso de Usuário</CardTitle>
            <CardDescription>
              Digite um email para verificar se tem acesso ao sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={checkAccess} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="test-email">Email para testar</Label>
                <Input
                  id="test-email"
                  type="email"
                  placeholder="usuario@exemplo.com"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isCheckingAccess}
              >
                {isCheckingAccess && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Verificar Acesso
              </Button>
            </form>

            {accessResult && (
              <div className="mt-4 p-4 rounded-lg border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Status do Acesso:</span>
                  <Badge variant={accessResult.hasAccess ? 'default' : 'destructive'}>
                    {accessResult.hasAccess ? 'Com Acesso ✓' : 'Sem Acesso ✗'}
                  </Badge>
                </div>

                {accessResult.hasAccess && accessResult.purchase && (
                  <div className="space-y-2 text-sm">
                    <div className="p-3 bg-muted rounded">
                      <p className="text-muted-foreground mb-2">Detalhes da Compra:</p>
                      <div className="space-y-1">
                        <p><strong>Email:</strong> {accessResult.purchase.email}</p>
                        <p><strong>Produto ID:</strong> {accessResult.purchase.product_id}</p>
                        <p><strong>Compra ID:</strong> {accessResult.purchase.purchase_id}</p>
                        <p><strong>Status:</strong> <Badge variant="outline">{accessResult.purchase.status}</Badge></p>
                        <p><strong>Data:</strong> {new Date(accessResult.purchase.created_at).toLocaleString('pt-BR')}</p>
                      </div>
                    </div>
                  </div>
                )}

                {!accessResult.hasAccess && (
                  <p className="text-sm text-muted-foreground">
                    Este email não possui nenhuma compra aprovada no sistema.
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instruções */}
        <Card>
          <CardHeader>
            <CardTitle>3. Próximos Passos</CardTitle>
            <CardDescription>
              O que fazer agora
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium">Configure o webhook na Hotmart</p>
                  <p className="text-sm text-muted-foreground">
                    Copie a URL do webhook acima e adicione no painel da Hotmart
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium">Selecione os eventos</p>
                  <p className="text-sm text-muted-foreground">
                    PURCHASE_APPROVED, PURCHASE_REFUNDED, PURCHASE_CHARGEBACK, PURCHASE_CANCELLED
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium">Faça uma compra de teste</p>
                  <p className="text-sm text-muted-foreground">
                    Ou use o simulador de webhooks da Hotmart
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <div>
                  <p className="font-medium">Teste o acesso</p>
                  <p className="text-sm text-muted-foreground">
                    Use o formulário acima para verificar se o email tem acesso
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button asChild variant="outline" className="w-full">
                <a href="/premium" target="_blank">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ver Exemplo de Página Premium
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Links Úteis */}
        <Card>
          <CardHeader>
            <CardTitle>📚 Documentação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="ghost" className="w-full justify-start">
              <a href="https://developers.hotmart.com/docs/pt-BR/v1/webhooks/introduction/" target="_blank">
                <ExternalLink className="h-4 w-4 mr-2" />
                Documentação da Hotmart sobre Webhooks
              </a>
            </Button>
            <p className="text-xs text-muted-foreground px-4">
              Veja o guia completo em: <code>/docs/HOTMART-WEBHOOK-GUIA.md</code>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
