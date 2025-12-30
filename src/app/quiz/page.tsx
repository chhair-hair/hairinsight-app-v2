'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz, Gender, HairType, WashFrequency, ProductType, HeatTools, HairGoal } from '@/lib/quiz-context';
import { Sparkles, ArrowLeft } from 'lucide-react';

export default function QuizPage() {
  const router = useRouter();
  const { quizData, updateQuizData, getThemeColors } = useQuiz();
  
  // Se já tem gênero selecionado, começa do step 2, senão começa do step 1
  const initialStep = quizData.gender ? 2 : 1;
  const [step, setStep] = useState(initialStep);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [answers, setAnswers] = useState({
    gender: quizData.gender || '',
    hairType: quizData.hairType || '',
    washFrequency: quizData.washFrequency || '',
    productType: quizData.productType || '',
    productTypeOther: quizData.productTypeOther || '',
    heatTools: quizData.heatTools || '',
    hairGoal: quizData.hairGoal || '',
  });

  const totalSteps = 6;
  const colors = getThemeColors();

  // Atualiza o step inicial quando o componente monta
  useEffect(() => {
    if (quizData.gender && step === 1) {
      setStep(2);
    }
  }, [quizData.gender]);

  const handleOptionClick = (field: string, value: string) => {
    const updatedAnswers = { ...answers, [field]: value };
    setAnswers(updatedAnswers);
    updateQuizData({ [field]: value });

    // Inicia transição suave
    setIsTransitioning(true);

    // Avança automaticamente após transição
    setTimeout(() => {
      if (step === totalSteps) {
        // Última pergunta - vai para captura de fotos
        router.push('/quiz/photos');
      } else {
        setStep(step + 1);
        setIsTransitioning(false);
      }
    }, 500);
  };

  const handleBack = () => {
    if (step === 1) {
      router.push('/');
    } else if (step === 2 && quizData.gender) {
      // Se está no step 2 e já tem gênero (veio da página inicial), volta para home
      router.push('/');
    } else {
      // Transição suave para voltar
      setIsTransitioning(true);
      setTimeout(() => {
        setStep(step - 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div
            key="step1"
            className="space-y-4 animate-fadeIn"
          >
            <h2 className="text-2xl font-bold mb-6">Qual é o seu gênero?</h2>
            <p className="text-white/60 mb-6">
              Isso nos ajudará a personalizar sua experiência com as cores ideais para você.
            </p>
            {[
              { value: 'feminino', label: 'Feminino', color: '#FF6F91' },
              { value: 'masculino', label: 'Masculino', color: '#9333EA' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => handleOptionClick('gender', option.value)}
                className={`w-full p-6 rounded-xl border-2 transition-all duration-300 text-left relative overflow-hidden group hover:scale-[1.02] active:scale-[0.98] ${
                  answers.gender === option.value
                    ? 'border-white/30 bg-white/10'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
                style={{
                  borderColor: answers.gender === option.value ? option.color : undefined,
                  backgroundColor: answers.gender === option.value ? `${option.color}15` : undefined,
                }}
              >
                <div className="relative z-10">
                  <span className="font-semibold text-lg">{option.label}</span>
                  <div className="mt-2 flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full shadow-lg"
                      style={{ backgroundColor: option.color }}
                    />
                  </div>
                </div>
              </button>
            ))}
          </div>
        );

      case 2:
        return (
          <div
            key="step2"
            className="space-y-4 animate-fadeIn"
          >
            <h2 className="text-2xl font-bold mb-6">Qual é o seu tipo de cabelo?</h2>
            {[
              { value: 'liso', label: 'Liso' },
              { value: 'ondulado', label: 'Ondulado' },
              { value: 'cacheado', label: 'Cacheado' },
              { value: 'crespo', label: 'Crespo' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => handleOptionClick('hairType', option.value)}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left hover:scale-[1.02] active:scale-[0.98] ${
                  answers.hairType === option.value
                    ? 'bg-white/10'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
                style={{
                  borderColor: answers.hairType === option.value ? colors.primary : undefined,
                  backgroundColor: answers.hairType === option.value ? `${colors.primary}15` : undefined,
                }}
              >
                <span className="font-medium">{option.label}</span>
              </button>
            ))}
          </div>
        );

      case 3:
        return (
          <div
            key="step3"
            className="space-y-4 animate-fadeIn"
          >
            <h2 className="text-2xl font-bold mb-6">Com que frequência você lava seu cabelo?</h2>
            {[
              { value: 'diariamente', label: 'Diariamente' },
              { value: '2-3-vezes', label: '2-3 vezes por semana' },
              { value: 'semanalmente', label: 'Semanalmente' },
              { value: 'menos-uma-vez', label: 'Menos de uma vez por semana' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => handleOptionClick('washFrequency', option.value)}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left hover:scale-[1.02] active:scale-[0.98] ${
                  answers.washFrequency === option.value
                    ? 'bg-white/10'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
                style={{
                  borderColor: answers.washFrequency === option.value ? colors.primary : undefined,
                  backgroundColor: answers.washFrequency === option.value ? `${colors.primary}15` : undefined,
                }}
              >
                <span className="font-medium">{option.label}</span>
              </button>
            ))}
          </div>
        );

      case 4:
        return (
          <div
            key="step4"
            className="space-y-4 animate-fadeIn"
          >
            <h2 className="text-2xl font-bold mb-6">Quais produtos você costuma usar?</h2>
            {[
              { value: 'convencionais', label: 'Shampoo e condicionador convencionais' },
              { value: 'naturais', label: 'Produtos naturais ou orgânicos' },
              { value: 'nenhum', label: 'Nenhum produto específico' },
              { value: 'outros', label: 'Outros (especificar)' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => handleOptionClick('productType', option.value)}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left hover:scale-[1.02] active:scale-[0.98] ${
                  answers.productType === option.value
                    ? 'bg-white/10'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
                style={{
                  borderColor: answers.productType === option.value ? colors.primary : undefined,
                  backgroundColor: answers.productType === option.value ? `${colors.primary}15` : undefined,
                }}
              >
                <span className="font-medium">{option.label}</span>
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
                      if (step === totalSteps) {
                        router.push('/quiz/photos');
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

      case 5:
        return (
          <div
            key="step5"
            className="space-y-4 animate-fadeIn"
          >
            <h2 className="text-2xl font-bold mb-6">Você utiliza ferramentas de calor no cabelo?</h2>
            {[
              { value: 'sim-regularmente', label: 'Sim, regularmente' },
              { value: 'sim-ocasionalmente', label: 'Sim, ocasionalmente' },
              { value: 'nao', label: 'Não' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => handleOptionClick('heatTools', option.value)}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left hover:scale-[1.02] active:scale-[0.98] ${
                  answers.heatTools === option.value
                    ? 'bg-white/10'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
                style={{
                  borderColor: answers.heatTools === option.value ? colors.primary : undefined,
                  backgroundColor: answers.heatTools === option.value ? `${colors.primary}15` : undefined,
                }}
              >
                <span className="font-medium">{option.label}</span>
              </button>
            ))}
          </div>
        );

      case 6:
        return (
          <div
            key="step6"
            className="space-y-4 animate-fadeIn"
          >
            <h2 className="text-2xl font-bold mb-6">Qual é o seu principal objetivo para o cuidado capilar?</h2>
            {[
              { value: 'hidratacao', label: 'Hidratação' },
              { value: 'fortalecimento', label: 'Fortalecimento' },
              { value: 'controle-frizz', label: 'Controle de frizz' },
              { value: 'crescimento', label: 'Crescimento saudável' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => handleOptionClick('hairGoal', option.value)}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left hover:scale-[1.02] active:scale-[0.98] ${
                  answers.hairGoal === option.value
                    ? 'bg-white/10'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
                style={{
                  borderColor: answers.hairGoal === option.value ? colors.primary : undefined,
                  backgroundColor: answers.hairGoal === option.value ? `${colors.primary}15` : undefined,
                }}
              >
                <span className="font-medium">{option.label}</span>
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
            <span className="text-sm text-white/80">Análise Personalizada</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Descubra o segredo para um cabelo saudável em minutos!
          </h1>
          
          <p className="text-white/60 text-lg">
            Responda a algumas perguntas rápidas sobre seu cabelo e rotinas.
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
