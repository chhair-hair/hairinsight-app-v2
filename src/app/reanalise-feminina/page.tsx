'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/lib/quiz-context';
import { Sparkles, ArrowLeft } from 'lucide-react';

export default function ReanalyseFemPage() {
  const router = useRouter();
  const { quizData, updateQuizData, getThemeColors } = useQuiz();

  const [step, setStep] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [answers, setAnswers] = useState({
    hairType: quizData.hairType || '',
    hairTexture: quizData.hairTexture || '',
    scalpType: quizData.scalpType || '',
    hairLength: quizData.hairLength || '',
    washFrequency: quizData.washFrequency || '',
    productType: quizData.productType || '',
    productTypeOther: quizData.productTypeOther || '',
    chemicalTreatments: quizData.chemicalTreatments || '',
    heatTools: quizData.heatTools || '',
    hairConcerns: quizData.hairConcerns || '',
    lifeStyle: quizData.lifeStyle || '',
    hairGoal: quizData.hairGoal || '',
  });

  const totalSteps = 11; // 12 perguntas menos a de gênero
  const colors = getThemeColors();

  const handleOptionClick = (field: string, value: string) => {
    const updatedAnswers = { ...answers, [field]: value };
    setAnswers(updatedAnswers);
    updateQuizData({ [field]: value });

    setIsTransitioning(true);

    setTimeout(() => {
      if (step === totalSteps) {
        router.push('/reanalise-photos-feminina');
      } else {
        setStep(step + 1);
        setIsTransitioning(false);
      }
    }, 500);
  };

  const handleBack = () => {
    if (step === 1) {
      router.push('/app');
    } else {
      setIsTransitioning(true);
      setTimeout(() => {
        setStep(step - 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const getMotivationalText = () => {
    const texts = [
      "Ótimo começo! Cada resposta nos ajuda a entender melhor o seu cabelo.",
      "Você está indo muito bem! Continue, estamos quase descobrindo seu perfil ideal.",
      "Perfeito! Suas respostas estão nos dando insights valiosos sobre seu cabelo.",
      "Incrível progresso! Em breve você terá uma rotina totalmente personalizada.",
      "Estamos adorando conhecer você! Continue para descobrir recomendações exclusivas.",
      "Você está a poucos passos de transformar seu cabelo! Continue assim.",
      "Maravilha! Cada detalhe que você compartilha torna sua análise mais precisa.",
      "Quase lá! Sua rotina capilar personalizada está sendo preparada.",
      "Excelente! Só mais algumas perguntas para completarmos seu perfil único.",
      "Último ajuste! Prepare-se para descobrir o que seu cabelo realmente precisa.",
    ];
    return texts[Math.min(step - 1, texts.length - 1)] || texts[0];
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div key="step1" className="space-y-4 animate-fadeIn">
            <p className="text-sm text-white/50 italic mb-4">{getMotivationalText()}</p>
            <h2 className="text-2xl font-bold mb-6">Qual é o formato do seu cabelo?</h2>
            <p className="text-white/60 mb-4">Isso define o padrão natural dos seus fios</p>
            {[
              { value: 'liso', label: 'Liso', desc: 'Fios retos, sem ondas' },
              { value: 'ondulado', label: 'Ondulado', desc: 'Ondas suaves em formato "S"' },
              { value: 'cacheado', label: 'Cacheado', desc: 'Cachos definidos e espirais' },
              { value: 'crespo', label: 'Crespo', desc: 'Cachos bem fechados ou em zigue-zague' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => handleOptionClick('hairType', option.value)}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left hover:scale-[1.02] active:scale-[0.98] ${
                  answers.hairType === option.value ? 'bg-white/10' : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
                style={{
                  borderColor: answers.hairType === option.value ? colors.primary : undefined,
                  backgroundColor: answers.hairType === option.value ? `${colors.primary}15` : undefined,
                }}
              >
                <span className="font-medium">{option.label}</span>
                <p className="text-sm text-white/50 mt-1">{option.desc}</p>
              </button>
            ))}
          </div>
        );

      case 2:
        return (
          <div key="step2" className="space-y-4 animate-fadeIn">
            <p className="text-sm text-white/50 italic mb-4">{getMotivationalText()}</p>
            <h2 className="text-2xl font-bold mb-6">Qual é a espessura dos seus fios?</h2>
            <p className="text-white/60 mb-4">A textura influencia diretamente nos produtos que funcionam melhor</p>
            {[
              { value: 'fino', label: 'Fino', desc: 'Fios delicados e suaves ao toque' },
              { value: 'medio', label: 'Médio', desc: 'Espessura balanceada, nem fino nem grosso' },
              { value: 'grosso', label: 'Grosso', desc: 'Fios mais volumosos e resistentes' },
              { value: 'muito-grosso', label: 'Muito Grosso', desc: 'Fios bastante densos e pesados' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => handleOptionClick('hairTexture', option.value)}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left hover:scale-[1.02] active:scale-[0.98] ${
                  answers.hairTexture === option.value ? 'bg-white/10' : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
                style={{
                  borderColor: answers.hairTexture === option.value ? colors.primary : undefined,
                  backgroundColor: answers.hairTexture === option.value ? `${colors.primary}15` : undefined,
                }}
              >
                <span className="font-medium">{option.label}</span>
                <p className="text-sm text-white/50 mt-1">{option.desc}</p>
              </button>
            ))}
          </div>
        );

      case 3:
        return (
          <div key="step3" className="space-y-4 animate-fadeIn">
            <p className="text-sm text-white/50 italic mb-4">{getMotivationalText()}</p>
            <h2 className="text-2xl font-bold mb-6">Como é o seu couro cabeludo?</h2>
            <p className="text-white/60 mb-4">O tipo de couro cabeludo determina a frequência ideal de lavagem</p>
            {[
              { value: 'oleoso', label: 'Oleoso', desc: 'Fica oleoso rapidamente, precisa lavar com frequência' },
              { value: 'normal', label: 'Normal', desc: 'Balanceado, nem muito oleoso nem seco' },
              { value: 'seco', label: 'Seco', desc: 'Couro cabeludo ressecado, pode causar coceira' },
              { value: 'misto', label: 'Misto', desc: 'Raiz oleosa e comprimento/pontas secas' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => handleOptionClick('scalpType', option.value)}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left hover:scale-[1.02] active:scale-[0.98] ${
                  answers.scalpType === option.value ? 'bg-white/10' : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
                style={{
                  borderColor: answers.scalpType === option.value ? colors.primary : undefined,
                  backgroundColor: answers.scalpType === option.value ? `${colors.primary}15` : undefined,
                }}
              >
                <span className="font-medium">{option.label}</span>
                <p className="text-sm text-white/50 mt-1">{option.desc}</p>
              </button>
            ))}
          </div>
        );

      case 4:
        return (
          <div key="step4" className="space-y-4 animate-fadeIn">
            <p className="text-sm text-white/50 italic mb-4">{getMotivationalText()}</p>
            <h2 className="text-2xl font-bold mb-6">Qual é o comprimento do seu cabelo?</h2>
            <p className="text-white/60 mb-4">O comprimento influencia no tempo e quantidade de produtos</p>
            {[
              { value: 'curto', label: 'Curto', desc: 'Até o pescoço ou mais curto' },
              { value: 'medio', label: 'Médio', desc: 'Até os ombros' },
              { value: 'longo', label: 'Longo', desc: 'Abaixo dos ombros' },
              { value: 'muito-longo', label: 'Muito Longo', desc: 'Na altura da cintura ou mais' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => handleOptionClick('hairLength', option.value)}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left hover:scale-[1.02] active:scale-[0.98] ${
                  answers.hairLength === option.value ? 'bg-white/10' : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
                style={{
                  borderColor: answers.hairLength === option.value ? colors.primary : undefined,
                  backgroundColor: answers.hairLength === option.value ? `${colors.primary}15` : undefined,
                }}
              >
                <span className="font-medium">{option.label}</span>
                <p className="text-sm text-white/50 mt-1">{option.desc}</p>
              </button>
            ))}
          </div>
        );

      case 5:
        return (
          <div key="step5" className="space-y-4 animate-fadeIn">
            <p className="text-sm text-white/50 italic mb-4">{getMotivationalText()}</p>
            <h2 className="text-2xl font-bold mb-6">Com que frequência você lava seu cabelo?</h2>
            <p className="text-white/60 mb-4">Isso nos ajuda a ajustar a intensidade dos produtos</p>
            {[
              { value: 'diariamente', label: 'Diariamente', desc: 'Todos os dias' },
              { value: '2-3-vezes', label: '2-3 vezes por semana', desc: 'Rotina intermediária' },
              { value: 'semanalmente', label: 'Semanalmente', desc: 'Uma vez por semana' },
              { value: 'menos-uma-vez', label: 'Menos de uma vez por semana', desc: 'Intervalo longo entre lavagens' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => handleOptionClick('washFrequency', option.value)}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left hover:scale-[1.02] active:scale-[0.98] ${
                  answers.washFrequency === option.value ? 'bg-white/10' : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
                style={{
                  borderColor: answers.washFrequency === option.value ? colors.primary : undefined,
                  backgroundColor: answers.washFrequency === option.value ? `${colors.primary}15` : undefined,
                }}
              >
                <span className="font-medium">{option.label}</span>
                <p className="text-sm text-white/50 mt-1">{option.desc}</p>
              </button>
            ))}
          </div>
        );

      case 6:
        return (
          <div key="step6" className="space-y-4 animate-fadeIn">
            <p className="text-sm text-white/50 italic mb-4">{getMotivationalText()}</p>
            <h2 className="text-2xl font-bold mb-6">Quais produtos você costuma usar?</h2>
            <p className="text-white/60 mb-4">Vamos entender sua rotina atual</p>
            {[
              { value: 'convencionais', label: 'Shampoo e condicionador convencionais', desc: 'Produtos de mercado tradicionais' },
              { value: 'naturais', label: 'Produtos naturais ou orgânicos', desc: 'Foco em ingredientes naturais' },
              { value: 'nenhum', label: 'Nenhum produto específico', desc: 'Uso apenas água ou produtos básicos' },
              { value: 'outros', label: 'Outros (especificar)', desc: 'Rotina diferenciada' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => handleOptionClick('productType', option.value)}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left hover:scale-[1.02] active:scale-[0.98] ${
                  answers.productType === option.value ? 'bg-white/10' : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
                style={{
                  borderColor: answers.productType === option.value ? colors.primary : undefined,
                  backgroundColor: answers.productType === option.value ? `${colors.primary}15` : undefined,
                }}
              >
                <span className="font-medium">{option.label}</span>
                <p className="text-sm text-white/50 mt-1">{option.desc}</p>
              </button>
            ))}
            {answers.productType === 'outros' && (
              <input
                type="text"
                placeholder="Especifique os produtos..."
                value={answers.productTypeOther}
                onChange={(e) => setAnswers({ ...answers, productTypeOther: e.target.value })}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && answers.productTypeOther) {
                    updateQuizData({ productTypeOther: answers.productTypeOther });
                    setIsTransitioning(true);
                    setTimeout(() => {
                      if (step >= totalSteps) {
                        router.push('/reanalise-photos-feminina');
                      } else {
                        setStep(step + 1);
                        setIsTransitioning(false);
                      }
                    }, 500);
                  }
                }}
                className="w-full p-4 rounded-xl border-2 border-white/10 bg-white/5 focus:outline-none transition-all duration-300 animate-fadeIn"
                style={{
                  borderColor: answers.productTypeOther ? colors.primary : undefined,
                }}
              />
            )}
          </div>
        );

      case 7:
        return (
          <div key="step7" className="space-y-4 animate-fadeIn">
            <p className="text-sm text-white/50 italic mb-4">{getMotivationalText()}</p>
            <h2 className="text-2xl font-bold mb-6">Você já fez algum tratamento químico?</h2>
            <p className="text-white/60 mb-4">Isso impacta significativamente na saúde e cuidado do cabelo</p>
            {[
              { value: 'nenhum', label: 'Nenhum', desc: 'Cabelo 100% natural, sem química' },
              { value: 'coloracao', label: 'Coloração', desc: 'Tinturas, luzes ou mechas' },
              { value: 'alisamento', label: 'Alisamento', desc: 'Progressiva, escova definitiva ou relaxamento' },
              { value: 'descoloracao', label: 'Descoloração', desc: 'Processo de clarear os fios' },
              { value: 'multiplos', label: 'Múltiplos tratamentos', desc: 'Combinação de processos químicos' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => handleOptionClick('chemicalTreatments', option.value)}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left hover:scale-[1.02] active:scale-[0.98] ${
                  answers.chemicalTreatments === option.value ? 'bg-white/10' : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
                style={{
                  borderColor: answers.chemicalTreatments === option.value ? colors.primary : undefined,
                  backgroundColor: answers.chemicalTreatments === option.value ? `${colors.primary}15` : undefined,
                }}
              >
                <span className="font-medium">{option.label}</span>
                <p className="text-sm text-white/50 mt-1">{option.desc}</p>
              </button>
            ))}
          </div>
        );

      case 8:
        return (
          <div key="step8" className="space-y-4 animate-fadeIn">
            <p className="text-sm text-white/50 italic mb-4">{getMotivationalText()}</p>
            <h2 className="text-2xl font-bold mb-6">Você utiliza ferramentas de calor?</h2>
            <p className="text-white/60 mb-4">Chapinha, secador e babyliss podem danificar os fios</p>
            {[
              { value: 'sim-regularmente', label: 'Sim, regularmente', desc: 'Uso quase todos os dias ou diariamente' },
              { value: 'sim-ocasionalmente', label: 'Sim, ocasionalmente', desc: 'Uso de vez em quando, em ocasiões especiais' },
              { value: 'nao', label: 'Não', desc: 'Não uso ferramentas de calor' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => handleOptionClick('heatTools', option.value)}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left hover:scale-[1.02] active:scale-[0.98] ${
                  answers.heatTools === option.value ? 'bg-white/10' : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
                style={{
                  borderColor: answers.heatTools === option.value ? colors.primary : undefined,
                  backgroundColor: answers.heatTools === option.value ? `${colors.primary}15` : undefined,
                }}
              >
                <span className="font-medium">{option.label}</span>
                <p className="text-sm text-white/50 mt-1">{option.desc}</p>
              </button>
            ))}
          </div>
        );

      case 9:
        return (
          <div key="step9" className="space-y-4 animate-fadeIn">
            <p className="text-sm text-white/50 italic mb-4">{getMotivationalText()}</p>
            <h2 className="text-2xl font-bold mb-6">Qual é a sua maior preocupação com o cabelo?</h2>
            <p className="text-white/60 mb-4">Vamos focar no que mais te incomoda</p>
            {[
              { value: 'queda', label: 'Queda de cabelo', desc: 'Perda excessiva de fios' },
              { value: 'caspa', label: 'Caspa ou coceira', desc: 'Problemas no couro cabeludo' },
              { value: 'pontas-duplas', label: 'Pontas duplas', desc: 'Pontas ressecadas e quebradiças' },
              { value: 'volume', label: 'Falta de volume', desc: 'Cabelo fino ou sem corpo' },
              { value: 'brilho', label: 'Falta de brilho', desc: 'Cabelo opaco e sem vida' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => handleOptionClick('hairConcerns', option.value)}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left hover:scale-[1.02] active:scale-[0.98] ${
                  answers.hairConcerns === option.value ? 'bg-white/10' : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
                style={{
                  borderColor: answers.hairConcerns === option.value ? colors.primary : undefined,
                  backgroundColor: answers.hairConcerns === option.value ? `${colors.primary}15` : undefined,
                }}
              >
                <span className="font-medium">{option.label}</span>
                <p className="text-sm text-white/50 mt-1">{option.desc}</p>
              </button>
            ))}
          </div>
        );

      case 10:
        return (
          <div key="step10" className="space-y-4 animate-fadeIn">
            <p className="text-sm text-white/50 italic mb-4">{getMotivationalText()}</p>
            <h2 className="text-2xl font-bold mb-6">Como é o seu estilo de vida?</h2>
            <p className="text-white/60 mb-4">Isso influencia nos produtos e na rotina ideal para você</p>
            {[
              { value: 'sedentario', label: 'Sedentário', desc: 'Pouca atividade física, ambiente climatizado' },
              { value: 'ativo', label: 'Ativo', desc: 'Exercícios moderados 2-3x por semana' },
              { value: 'muito-ativo', label: 'Muito Ativo', desc: 'Exercícios frequentes 4-5x por semana' },
              { value: 'atleta', label: 'Atleta', desc: 'Treinos intensos diários ou profissional' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => handleOptionClick('lifeStyle', option.value)}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left hover:scale-[1.02] active:scale-[0.98] ${
                  answers.lifeStyle === option.value ? 'bg-white/10' : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
                style={{
                  borderColor: answers.lifeStyle === option.value ? colors.primary : undefined,
                  backgroundColor: answers.lifeStyle === option.value ? `${colors.primary}15` : undefined,
                }}
              >
                <span className="font-medium">{option.label}</span>
                <p className="text-sm text-white/50 mt-1">{option.desc}</p>
              </button>
            ))}
          </div>
        );

      case 11:
        return (
          <div key="step11" className="space-y-4 animate-fadeIn">
            <p className="text-sm text-white/50 italic mb-4">{getMotivationalText()}</p>
            <h2 className="text-2xl font-bold mb-6">Qual é o seu objetivo principal?</h2>
            <p className="text-white/60 mb-4">Última pergunta! Vamos descobrir o que você realmente busca</p>
            {[
              { value: 'hidratacao', label: 'Hidratação profunda', desc: 'Recuperar a maciez e saúde dos fios' },
              { value: 'fortalecimento', label: 'Fortalecimento', desc: 'Reduzir quebra e fortalecer a fibra capilar' },
              { value: 'controle-frizz', label: 'Controle de frizz', desc: 'Domar o frizz e ter fios mais disciplinados' },
              { value: 'crescimento', label: 'Crescimento saudável', desc: 'Estimular o crescimento e prevenir queda' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => handleOptionClick('hairGoal', option.value)}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left hover:scale-[1.02] active:scale-[0.98] ${
                  answers.hairGoal === option.value ? 'bg-white/10' : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
                style={{
                  borderColor: answers.hairGoal === option.value ? colors.primary : undefined,
                  backgroundColor: answers.hairGoal === option.value ? `${colors.primary}15` : undefined,
                }}
              >
                <span className="font-medium">{option.label}</span>
                <p className="text-sm text-white/50 mt-1">{option.desc}</p>
              </button>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeInDown">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border mb-6"
            style={{ borderColor: `${colors.primary}30` }}
          >
            <Sparkles className="w-4 h-4" style={{ color: colors.primary }} />
            <span className="text-sm text-white/80">Reanálise Capilar</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Atualize sua rotina personalizada
          </h1>

          <p className="text-white/60 text-lg">
            Responda novamente para ter uma análise ainda mais precisa.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 animate-fadeIn">
          <div className="flex justify-end items-center text-sm text-white/60 mb-2">
            <span>{Math.round((step / totalSteps) * 100)}%</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-500 ease-out"
              style={{
                background: `linear-gradient(to right, ${colors.primary}, ${colors.primaryLight})`,
                width: `${(step / totalSteps) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Question */}
        {renderStep()}

        {/* Navigation */}
        <div className="flex gap-4 mt-8 animate-fadeIn">
          <button
            onClick={handleBack}
            disabled={isTransitioning}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 disabled:opacity-50 hover:scale-105 active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .animate-fadeInDown {
          animation: fadeInDown 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
