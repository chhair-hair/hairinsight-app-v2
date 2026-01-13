'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz, Gender, HairType, WashFrequency, ProductType, HeatTools, HairGoal } from '@/lib/quiz-context';
import { Sparkles, ArrowLeft } from 'lucide-react';

export default function ReanalyseFemPage() {
  const router = useRouter();
  const { quizData, updateQuizData, getThemeColors } = useQuiz();

  const [step, setStep] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [answers, setAnswers] = useState({
    hairType: quizData.hairType || '',
    washFrequency: quizData.washFrequency || '',
    productType: quizData.productType || '',
    productTypeOther: quizData.productTypeOther || '',
    heatTools: quizData.heatTools || '',
    hairGoal: quizData.hairGoal || '',
  });

  const totalSteps = 5; // Sem a pergunta de gênero
  const colors = getThemeColors();

  const handleOptionClick = (field: string, value: string) => {
    const updatedAnswers = { ...answers, [field]: value };
    setAnswers(updatedAnswers);
    updateQuizData({ [field]: value });

    // Inicia transição suave
    setIsTransitioning(true);

    // Avança automaticamente após transição
    setTimeout(() => {
      if (step === totalSteps) {
        // Última pergunta - vai para captura de fotos de reanálise
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

      case 2:
        return (
          <div
            key="step2"
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

      case 3:
        return (
          <div
            key="step3"
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
                    handleOptionClick('productTypeOther', answers.productTypeOther);
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

      case 4:
        return (
          <div
            key="step4"
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

      case 5:
        return (
          <div
            key="step5"
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
            <span className="text-sm text-white/80">Reanálise Personalizada</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Atualize sua rotina capilar
          </h1>

          <p className="text-white/60 text-lg">
            Responda novamente para atualizar sua rotina com base nas suas necessidades atuais.
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
