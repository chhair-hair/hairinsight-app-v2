'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Check, X, Loader2 } from 'lucide-react';

export default function TesteOpenAIPage() {
  const [testando, setTestando] = useState(false);
  const [resultado, setResultado] = useState<any>(null);
  const [erro, setErro] = useState<string | null>(null);

  const testarOpenAI = async () => {
    setTestando(true);
    setResultado(null);
    setErro(null);

    try {
      // Testar se a chave está configurada
      const configResponse = await fetch('/api/test-openai');
      const configData = await configResponse.json();

      if (!configData.success) {
        setErro(configData.error);
        setTestando(false);
        return;
      }

      // Criar uma imagem de teste (quadrado branco 100x100)
      const canvas = document.createElement('canvas');
      canvas.width = 100;
      canvas.height = 100;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, 100, 100);
      const testImage = canvas.toDataURL('image/png');

      // Testar análise de fotos
      const analysisResponse = await fetch('/api/analyze-photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photos: {
            left: testImage,
            right: testImage,
            down: testImage
          }
        })
      });

      if (!analysisResponse.ok) {
        const errorData = await analysisResponse.json();
        throw new Error(errorData.details || errorData.error || 'Erro desconhecido');
      }

      const analysisData = await analysisResponse.json();

      setResultado({
        config: configData,
        analysis: analysisData.analysis
      });
    } catch (err: any) {
      console.error('Erro no teste:', err);
      setErro(err.message);
    } finally {
      setTestando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-purple-500/30 mb-4">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-white/80">Diagnóstico OpenAI</span>
          </div>

          <h1 className="text-3xl font-bold mb-2">
            Teste de Integração OpenAI
          </h1>

          <p className="text-white/60">
            Verifique se sua chave da OpenAI está configurada e funcionando corretamente
          </p>
        </div>

        {/* Botão de Teste */}
        <div className="text-center mb-8">
          <button
            onClick={testarOpenAI}
            disabled={testando}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-purple-500 to-purple-700 text-white hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {testando ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Testando...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Testar OpenAI</span>
              </>
            )}
          </button>
        </div>

        {/* Resultado do Teste */}
        {erro && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-4">
            <div className="flex items-start gap-3">
              <X className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-red-400 mb-2">Erro</h3>
                <p className="text-white/80 text-sm">{erro}</p>

                {erro.includes('não configurada') && (
                  <div className="mt-4 p-4 bg-white/5 rounded-lg">
                    <p className="text-white/60 text-sm mb-2">Para configurar:</p>
                    <ol className="text-white/80 text-sm space-y-2 list-decimal list-inside">
                      <li>Acesse <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener" className="text-purple-400 underline">OpenAI API Keys</a></li>
                      <li>Crie uma nova chave ou copie uma existente</li>
                      <li>Cole a chave no arquivo .env.local na variável OPENAI_API_KEY</li>
                      <li>Recarregue esta página</li>
                    </ol>
                  </div>
                )}

                {erro.includes('créditos') && (
                  <div className="mt-4 p-4 bg-white/5 rounded-lg">
                    <p className="text-white/60 text-sm mb-2">Adicione créditos na OpenAI:</p>
                    <a
                      href="https://platform.openai.com/account/billing"
                      target="_blank"
                      rel="noopener"
                      className="text-purple-400 underline text-sm"
                    >
                      https://platform.openai.com/account/billing
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {resultado && (
          <div className="space-y-4">
            {/* Status da Configuração */}
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <Check className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-green-400 mb-2">Chave Configurada</h3>
                  <div className="space-y-1 text-sm">
                    <p className="text-white/60">
                      Formato: <span className="text-white/80 font-mono">{resultado.config.keyFormat}</span>
                    </p>
                    <p className="text-white/60">
                      Tamanho: <span className="text-white/80">{resultado.config.keyLength} caracteres</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status da Análise */}
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <Check className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-green-400 mb-2">Análise Funcionando</h3>
                  <p className="text-white/60 text-sm mb-3">
                    A OpenAI Vision API está respondendo corretamente
                  </p>
                  <div className="bg-white/5 rounded-lg p-4 space-y-2 text-sm">
                    <p className="text-white/60">
                      Tipo de Cabelo: <span className="text-white/80">{resultado.analysis.hairType}</span>
                    </p>
                    <p className="text-white/60">
                      Nível de Dano: <span className="text-white/80">{resultado.analysis.damageLevel}</span>
                    </p>
                    <p className="text-white/60">
                      Porosidade: <span className="text-white/80">{resultado.analysis.porosity}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Informações de Custo */}
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <Sparkles className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-purple-400 mb-2">Informações de Custo</h3>
                  <div className="space-y-2 text-sm text-white/80">
                    <p>• Modelo usado: <span className="font-mono">gpt-4o</span> (GPT-4 with Vision)</p>
                    <p>• Custo estimado por análise: ~$0.01 USD</p>
                    <p>• Inclui análise de até 3 fotos</p>
                    <p>• Seus créditos: $10 USD = ~1000 análises</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Próximos Passos */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-semibold mb-3">Tudo Pronto!</h3>
              <p className="text-white/60 text-sm mb-4">
                Sua integração com OpenAI está funcionando perfeitamente. Você pode agora:
              </p>
              <ul className="space-y-2 text-sm text-white/80">
                <li>• Usar o app para analisar fotos de cabelo</li>
                <li>• Cada análise custará cerca de $0.01 USD</li>
                <li>• A análise leva de 3-5 segundos para processar</li>
                <li>• Resultados são baseados em IA real da OpenAI</li>
              </ul>
            </div>
          </div>
        )}

        {/* Instruções Iniciais */}
        {!testando && !resultado && !erro && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="font-semibold mb-3">Como funciona:</h3>
            <ol className="space-y-2 text-sm text-white/80 list-decimal list-inside">
              <li>Clique no botão "Testar OpenAI" acima</li>
              <li>Vamos verificar se sua chave está configurada</li>
              <li>Faremos um teste real com a Vision API</li>
              <li>Você verá o resultado e informações de custo</li>
            </ol>
          </div>
        )}

        {/* Link para voltar */}
        <div className="text-center mt-8">
          <a
            href="/"
            className="text-purple-400 hover:text-purple-300 text-sm underline"
          >
            Voltar para o início
          </a>
        </div>
      </div>
    </div>
  );
}
