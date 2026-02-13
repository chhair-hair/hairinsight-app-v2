'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/lib/quiz-context';
import { Sparkles, Camera, Upload, ArrowRight } from 'lucide-react';

export default function ReanalyseFotosFemPage() {
  const router = useRouter();
  const { quizData, updateQuizData, getThemeColors } = useQuiz();
  const colors = getThemeColors();
  const [photos, setPhotos] = useState({
    left: quizData.photos?.left || null,
    right: quizData.photos?.right || null,
    down: quizData.photos?.down || null,
  });

  const photoInstructions = {
    left: {
      title: 'Lado Esquerdo',
      description: 'Tire uma foto do lado esquerdo do seu cabelo'
    },
    right: {
      title: 'Lado Direito',
      description: 'Tire uma foto do lado direito do seu cabelo'
    },
    down: {
      title: 'De Baixo',
      description: 'Tire uma foto de baixo para cima do seu cabelo'
    }
  };

  const handlePhotoUpload = (side: 'left' | 'right' | 'down', file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPhotos(prev => ({ ...prev, [side]: result }));
      updateQuizData({
        photos: { ...quizData.photos, [side]: result }
      });
    };
    reader.readAsDataURL(file);
  };

  const allPhotosUploaded = photos.left && photos.right && photos.down;

  const handleContinue = () => {
    if (allPhotosUploaded) {
      router.push('/reanalise-analisando-feminina');
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border mb-6"
            style={{ borderColor: `${colors.primary}30` }}
          >
            <Sparkles className="w-4 h-4" style={{ color: colors.primary }} />
            <span className="text-sm text-white/80">Reanálise Visual</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Atualize as fotos do seu cabelo
          </h1>

          <p className="text-white/60 text-lg">
            Tire novas fotos para nossa IA reanalisar seu cabelo e atualizar sua rotina.
          </p>
        </div>

        {/* Photo Upload Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {Object.entries(photoInstructions).map(([side, instruction]) => (
            <div key={side} className="space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
                <div className="mb-4">
                  {photos[side as keyof typeof photos] ? (
                    <img
                      src={photos[side as keyof typeof photos]!}
                      alt={instruction.title}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-32 bg-white/10 rounded-lg flex items-center justify-center">
                      <Camera className="w-12 h-12 text-white/40" />
                    </div>
                  )}
                </div>

                <h3 className="font-semibold mb-2">{instruction.title}</h3>
                <p className="text-white/60 text-sm mb-4">{instruction.description}</p>

                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handlePhotoUpload(side as 'left' | 'right' | 'down', file);
                      }
                    }}
                  />
                  <div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
                    style={{
                      backgroundColor: colors.primary,
                      color: '#0D0D0D'
                    }}
                  >
                    <Upload className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {photos[side as keyof typeof photos] ? 'Alterar' : 'Tirar Foto'}
                    </span>
                  </div>
                </label>
              </div>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-white/60 mb-2">
            <span>Fotos enviadas</span>
            <span>{Object.values(photos).filter(Boolean).length}/3</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${(Object.values(photos).filter(Boolean).length / 3) * 100}%`,
                background: `linear-gradient(to right, ${colors.primary}, ${colors.primaryLight})`,
              }}
            />
          </div>
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <button
            onClick={handleContinue}
            disabled={!allPhotosUploaded}
            className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
              allPhotosUploaded
                ? 'hover:scale-105'
                : 'opacity-50 cursor-not-allowed'
            }`}
            style={{
              backgroundColor: allPhotosUploaded ? colors.primary : '#666',
              color: '#0D0D0D'
            }}
          >
            <span>Reanalisar Fotos</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          {!allPhotosUploaded && (
            <p className="text-white/40 text-sm mt-2">
              Envie todas as 3 fotos para continuar
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
