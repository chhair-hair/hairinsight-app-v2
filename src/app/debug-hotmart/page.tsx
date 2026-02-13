'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, XCircle, Loader2, AlertTriangle, Copy } from 'lucide-react';
import { toast } from 'sonner';

export default function DebugHotmart() {
  const [isLoading, setIsLoading] = useState(false);
  const [debugResult, setDebugResult] = useState<any>(null);

  // Payload de teste padrão da Hotmart
  const defaultPayload = JSON.stringify({
    event: 'PURCHASE_APPROVED',
    id: 'TEST-' + Date.now(),
    creation_date: Date.now(),
    data: {
      purchase: {
        order_id: 'ORDER-TEST-' + Date.now(),
        transaction: 'TXN-TEST-' + Date.now(),
        status: 'approved',
        buyer: {
          name: 'João da Silva',
          email: 'joao.teste@example.com'
        },
        product: {
          id: '12345',
          name: 'Produto de Teste'
        },
        price: {
          value: 97.00,
          currency_code: 'BRL'
        }
      }
    }
  }, null, 2);

  const [payload, setPayload] = useState(defaultPayload);
  const [signature, setSignature] = useState('');

  const testWebhook = async () => {
    setIsLoading(true);
    setDebugResult(null);

    try {
      // Remove espaços e quebras de linha do payload para enviar
      const cleanPayload = JSON.stringify(JSON.parse(payload));

      const response = await fetch('/api/webhook/hotmart/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(signature && { 'x-hotmart-hottok': signature }),
        },
        body: cleanPayload,
      });

      const data = await response.json();
      setDebugResult(data);

      if (data.checks?.signaturesMatch) {
        toast.success('✅ Assinaturas batem! Webhook está configurado corretamente!');
      } else if (data.checks?.secretConfigured === false) {
        toast.error('❌ Secret não está configurado!');
      } else {
        toast.error('❌ Assinatura não bate! Verifique o secret.');
      }

    } catch (error) {
      toast.error('Erro ao testar webhook');
      setDebugResult({ error: String(error) });
    } finally {
      setIsLoading(false);
    }
  };

  const copyCalculatedSignature = () => {
    if (debugResult?.checks?.calculatedSignature) {
      navigator.clipboard.writeText(debugResult.checks.calculatedSignature);
      toast.success('Assinatura calculada copiada!');
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-background to-muted">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold">🔍 Debug Webhook Hotmart</h1>
          <p className="text-muted-foreground">
            Descubra exatamente qual é o problema na configuração
          </p>
        </div>

        {/* Formulário de Teste */}
        <Card>
          <CardHeader>
            <CardTitle>1. Enviar Teste de Webhook</CardTitle>
            <CardDescription>
              Simula o envio da Hotmart para identificar problemas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Payload (JSON)</Label>
              <Textarea
                value={payload}
                onChange={(e) => setPayload(e.target.value)}
                rows={12}
                className="font-mono text-xs"
                placeholder="Cole aqui o JSON que a Hotmart envia"
              />
            </div>

            <div className="space-y-2">
              <Label>Assinatura (x-hotmart-hottok) - Opcional</Label>
              <Input
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                placeholder="Deixe vazio para testar sem assinatura"
              />
              <p className="text-xs text-muted-foreground">
                Se você tem uma assinatura de teste da Hotmart, cole aqui
              </p>
            </div>

            <Button
              onClick={testWebhook}
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Enviar Teste
            </Button>
          </CardContent>
        </Card>

        {/* Resultado do Debug */}
        {debugResult && (
          <>
            {/* Status Geral */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  2. Resultado do Teste
                  {debugResult.checks?.signaturesMatch ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Status do Secret */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center gap-2 mb-1">
                      {debugResult.checks?.secretConfigured ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span className="text-sm font-medium">Secret</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {debugResult.checks?.secretConfigured ? 'Configurado' : 'NÃO configurado'}
                    </p>
                    {debugResult.checks?.secretLength && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {debugResult.checks.secretLength} caracteres
                      </p>
                    )}
                  </div>

                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center gap-2 mb-1">
                      {debugResult.checks?.bodyReceived ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span className="text-sm font-medium">Body</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {debugResult.checks?.bodyLength} bytes
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center gap-2 mb-1">
                      {debugResult.checks?.signatureReceived ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      )}
                      <span className="text-sm font-medium">Assinatura</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {debugResult.checks?.signatureReceived ? 'Recebida' : 'Não enviada'}
                    </p>
                  </div>
                </div>

                {/* Alerta sobre espaços no secret */}
                {debugResult.checks?.secretHasSpaces && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>⚠️ Problema encontrado:</strong> O secret tem espaços no início ou no fim!
                      Remova os espaços extras do HOTMART_WEBHOOK_SECRET.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Comparação de Assinaturas */}
                {debugResult.checks?.calculatedSignature && (
                  <div className="space-y-3">
                    <h3 className="font-medium">Comparação de Assinaturas HMAC:</h3>

                    <div className="space-y-2">
                      <div className="p-3 rounded-lg bg-muted">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-muted-foreground">
                            Assinatura Calculada (seu servidor):
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={copyCalculatedSignature}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <code className="text-xs break-all block font-mono">
                          {debugResult.checks.calculatedSignature}
                        </code>
                      </div>

                      <div className="p-3 rounded-lg bg-muted">
                        <span className="text-xs font-medium text-muted-foreground block mb-1">
                          Assinatura Recebida (Hotmart):
                        </span>
                        <code className="text-xs break-all block font-mono">
                          {debugResult.checks.signatureValue || 'Nenhuma assinatura foi enviada'}
                        </code>
                      </div>

                      <div className={`p-4 rounded-lg border-2 ${
                        debugResult.checks.signaturesMatch
                          ? 'bg-green-500/10 border-green-500'
                          : 'bg-red-500/10 border-red-500'
                      }`}>
                        <div className="flex items-center gap-2">
                          {debugResult.checks.signaturesMatch ? (
                            <>
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                              <span className="font-medium text-green-700 dark:text-green-400">
                                ✅ Assinaturas batem! Webhook está correto!
                              </span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-5 w-5 text-red-500" />
                              <span className="font-medium text-red-700 dark:text-red-400">
                                ❌ Assinaturas diferentes! Verifique o secret.
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* JSON Completo para Debug */}
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-medium mb-2">
                    Ver JSON completo do debug
                  </summary>
                  <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">
                    {JSON.stringify(debugResult, null, 2)}
                  </pre>
                </details>
              </CardContent>
            </Card>

            {/* Instruções baseadas no resultado */}
            <Card>
              <CardHeader>
                <CardTitle>3. O que fazer agora?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {!debugResult.checks?.secretConfigured && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Ação necessária:</strong> Configure o HOTMART_WEBHOOK_SECRET nas variáveis de ambiente.
                      Este é o "Token de Segurança" que a Hotmart fornece quando você cria o webhook.
                    </AlertDescription>
                  </Alert>
                )}

                {debugResult.checks?.secretConfigured && !debugResult.checks?.signaturesMatch && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Problema identificado:</strong> O secret está configurado mas a assinatura não bate.
                      Isso significa que o secret que você configurou é diferente do que a Hotmart está usando.
                      <br /><br />
                      <strong>Solução:</strong> Copie novamente o "Token de Segurança" da Hotmart e reconfigure o HOTMART_WEBHOOK_SECRET.
                    </AlertDescription>
                  </Alert>
                )}

                {debugResult.checks?.signaturesMatch && (
                  <Alert className="bg-green-500/10 border-green-500">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <AlertDescription>
                      <strong>Tudo certo!</strong> O webhook está configurado corretamente.
                      A Hotmart conseguirá enviar notificações de compra para seu sistema.
                      <br /><br />
                      Agora você pode:
                      <ul className="list-disc ml-5 mt-2 space-y-1">
                        <li>Fazer uma compra de teste</li>
                        <li>Usar o simulador de webhooks da Hotmart</li>
                        <li>Verificar os dados salvos em /teste-hotmart</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* Instruções Iniciais */}
        {!debugResult && (
          <Card>
            <CardHeader>
              <CardTitle>📚 Como usar este teste</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>Este teste vai identificar exatamente qual é o problema:</p>
              <ol className="list-decimal ml-5 space-y-2">
                <li><strong>Secret não configurado</strong> - O sistema dirá se falta adicionar o HOTMART_WEBHOOK_SECRET</li>
                <li><strong>Secret com espaços</strong> - Detecta se você copiou espaços extras acidentalmente</li>
                <li><strong>Secret errado</strong> - Compara a assinatura calculada com a que deveria ser</li>
                <li><strong>Problema no payload</strong> - Verifica se o JSON está sendo lido corretamente</li>
              </ol>
              <p className="text-muted-foreground mt-4">
                💡 <strong>Dica:</strong> Clique em "Enviar Teste" primeiro sem assinatura, para verificar se o secret está configurado.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
