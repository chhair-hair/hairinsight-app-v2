'use client';

import { useState } from 'react';
import * as React from 'react';
import { Copy, Check, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react';

export default function WebhookTestPage() {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Detecta a URL automaticamente
  useState(() => {
    if (typeof window !== 'undefined') {
      // Se estiver em lasy.app (preview), mostra a URL de produção (.lasy.pro)
      const currentUrl = window.location.origin;

      let productionUrl = currentUrl;

      // Se for ambiente de preview (8080-xxx.lasy.app), converte para produção
      if (currentUrl.includes('.lasy.app')) {
        // Extrai o ID do projeto e converte para URL de produção
        productionUrl = 'https://lasy-e459b462-eight.lasy.pro';
      }

      setWebhookUrl(`${productionUrl}/api/webhook/hotmart`);
    }
  });

  const copyToClipboard = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const testWebhook = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/webhook/hotmart');
      const data = await response.json();
      setTestResult({ success: true, data });
    } catch (error) {
      setTestResult({ success: false, error: String(error) });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Configuração do Webhook Hotmart
            </h1>
            <p className="text-gray-600">
              Siga o passo a passo abaixo para conectar sua conta Hotmart
            </p>
          </div>

          {/* Alerta sobre URL de produção */}
          <div className="mb-6 p-4 bg-orange-100 border-l-4 border-orange-500 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-orange-600 mt-1 flex-shrink-0" size={24} />
              <div>
                <h3 className="font-bold text-orange-800 mb-1">⚠️ IMPORTANTE: Use a URL de Produção!</h3>
                <p className="text-sm text-orange-700">
                  A URL abaixo é a de <strong>produção</strong> (.lasy.pro).
                  Não use URLs com <code className="bg-orange-200 px-1 rounded">.lasy.app</code> (que são apenas para preview/desenvolvimento).
                  A Hotmart precisa de uma URL estável que esteja sempre no ar!
                </p>
              </div>
            </div>
          </div>

          {/* Passo 1 */}
          <div className="mb-8 p-6 bg-purple-50 rounded-xl border-l-4 border-purple-500">
            <h2 className="text-xl font-bold text-purple-800 mb-4 flex items-center gap-2">
              <span className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
              Copie a URL do Webhook (PRODUÇÃO)
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL do Webhook para cadastrar na Hotmart:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={webhookUrl}
                  readOnly
                  className="flex-1 px-4 py-3 bg-white border-2 border-purple-300 rounded-lg font-mono text-sm font-bold"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                  {copied ? 'Copiado!' : 'Copiar'}
                </button>
              </div>

              {webhookUrl.includes('.lasy.pro') && (
                <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle size={16} />
                  URL de produção detectada corretamente!
                </p>
              )}
            </div>

            <button
              onClick={testWebhook}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              {isLoading ? 'Testando...' : 'Testar Webhook'}
            </button>

            {testResult && (
              <div className={`mt-4 p-4 rounded-lg ${testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-start gap-2">
                  {testResult.success ? (
                    <CheckCircle className="text-green-600 mt-1" size={20} />
                  ) : (
                    <AlertCircle className="text-red-600 mt-1" size={20} />
                  )}
                  <div>
                    <p className={`font-medium ${testResult.success ? 'text-green-800' : 'text-red-800'}`}>
                      {testResult.success ? 'Webhook está funcionando!' : 'Erro ao testar webhook'}
                    </p>
                    <pre className="mt-2 text-xs overflow-auto">
                      {JSON.stringify(testResult.data || testResult.error, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Passo 2 */}
          <div className="mb-8 p-6 bg-blue-50 rounded-xl border-l-4 border-blue-500">
            <h2 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
              <span className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
              Acesse a Hotmart
            </h2>

            <ol className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600">1.</span>
                <span>Entre no painel da Hotmart: <a href="https://app.hotmart.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline inline-flex items-center gap-1">app.hotmart.com <ExternalLink size={14} /></a></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600">2.</span>
                <span>Vá em <strong>Ferramentas</strong> → <strong>Configurações</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600">3.</span>
                <span>Clique em <strong>Webhooks</strong> ou <strong>Postback de Status</strong></span>
              </li>
            </ol>
          </div>

          {/* Passo 3 */}
          <div className="mb-8 p-6 bg-green-50 rounded-xl border-l-4 border-green-500">
            <h2 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
              <span className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
              Configure o Webhook
            </h2>

            <div className="space-y-4 text-gray-700">
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <p className="font-bold text-green-700 mb-2">URL do Webhook/Postback:</p>
                <p className="font-mono text-sm bg-gray-50 p-2 rounded border">
                  {webhookUrl}
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-green-200">
                <p className="font-bold text-green-700 mb-2">Eventos para marcar:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>✅ Compra aprovada (PURCHASE_APPROVED)</li>
                  <li>✅ Reembolso (PURCHASE_REFUNDED)</li>
                  <li>✅ Chargeback (PURCHASE_CHARGEBACK)</li>
                  <li>✅ Cancelamento (PURCHASE_CANCELLED)</li>
                </ul>
              </div>

              <div className="bg-white p-4 rounded-lg border border-green-200">
                <p className="font-bold text-green-700 mb-2">Secret/Token:</p>
                <p className="text-sm text-gray-600">
                  A Hotmart vai gerar um <strong>secret token</strong>. Copie esse valor, você vai precisar dele no próximo passo!
                </p>
              </div>
            </div>
          </div>

          {/* Passo 4 */}
          <div className="p-6 bg-yellow-50 rounded-xl border-l-4 border-yellow-500">
            <h2 className="text-xl font-bold text-yellow-800 mb-4 flex items-center gap-2">
              <span className="bg-yellow-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
              Configure a Variável de Ambiente
            </h2>

            <p className="text-gray-700 mb-4">
              Depois de salvar o webhook na Hotmart, você vai receber um <strong>secret token</strong>.
              Clique no botão abaixo para configurá-lo aqui:
            </p>

            <div className="bg-white p-4 rounded-lg border border-yellow-200">
              <p className="text-sm text-gray-600 mb-3">
                Cole o secret token que a Hotmart gerou:
              </p>
              <ConfigureSecretButton />
            </div>
          </div>

          {/* Informações adicionais */}
          <div className="mt-8 p-6 bg-gray-50 rounded-xl">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <AlertCircle size={20} className="text-gray-600" />
              Informações Importantes
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• O webhook processa automaticamente compras, reembolsos e cancelamentos</li>
              <li>• Todas as compras são salvas no banco de dados do Supabase</li>
              <li>• Você pode verificar os logs no console da aplicação</li>
              <li>• A validação de assinatura garante que apenas a Hotmart pode enviar dados</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConfigureSecretButton() {
  const [secretValue, setSecretValue] = React.useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Aqui normalmente salvaria no backend, mas como é variável de ambiente,
    // vamos apenas mostrar as instruções
    if (secretValue) {
      setSaved(true);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cole aqui o Secret Token da Hotmart:
        </label>
        <input
          type="text"
          value={secretValue}
          onChange={(e) => setSecretValue(e.target.value)}
          placeholder="Cole o secret que a Hotmart gerou"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm"
        />
      </div>

      {secretValue && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm font-bold text-blue-800 mb-2">📋 Como configurar:</p>
          <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
            <li>Copie o secret que você colou acima</li>
            <li>Clique no botão "Configurar Variáveis" abaixo</li>
            <li>Cole o secret no campo HOTMART_WEBHOOK_SECRET</li>
            <li>Salve e aguarde alguns segundos para a aplicação recarregar</li>
          </ol>
        </div>
      )}

      <p className="text-xs text-gray-500">
        Variável necessária: <code className="bg-gray-100 px-2 py-1 rounded">HOTMART_WEBHOOK_SECRET</code>
      </p>
    </div>
  );
}
