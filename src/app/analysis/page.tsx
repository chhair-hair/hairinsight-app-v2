'use client';

import { useState } from 'react';
import Navbar from '@/components/custom/navbar';
import { Camera, Upload, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Gender } from '@/lib/types';

export default function AnalysisPage() {
  const [gender] = useState<Gender>('feminino'); // TODO: Get from context/state
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const accentColor = gender === 'feminino' ? '#FF6F91' : '#9B59B6';

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // TODO: Integrate with OpenAI API
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 2000);
  };

  const analysisSteps = [
    { title: 'Upload da Foto', description: 'Envie uma foto clara do seu cabelo' },
    { title: 'Análise com IA', description: 'Nossa IA analisa tipo, condição e formato' },
    { title: 'Recomendações', description: 'Receba dicas personalizadas de cuidados' },
  ];

  return (
    <div className="min-h-screen">
      <Navbar gender={gender} />
      
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4">
              <Camera className="w-4 h-4" style={{ color: accentColor }} />
              <span className="text-sm text-white/80">Análise com IA</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Análise de <span style={{ color: accentColor }}>Cabelo</span>
            </h1>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Descubra seu tipo de cabelo, formato de rosto e receba recomendações personalizadas
            </p>
          </div>

          {/* Analysis Steps */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {analysisSteps.map((step, index) => (
              <div
                key={index}
                className="relative rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 font-bold"
                  style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
                >
                  {index + 1}
                </div>
                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-white/60">{step.description}</p>
              </div>
            ))}
          </div>

          {/* Upload Area */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 mb-8">
            {!selectedImage ? (
              <label className="block cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="flex flex-col items-center justify-center py-12">
                  <div 
                    className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
                    style={{ backgroundColor: `${accentColor}20` }}
                  >
                    <Upload className="w-10 h-10" style={{ color: accentColor }} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Envie sua foto</h3>
                  <p className="text-white/60 mb-6 text-center max-w-md">
                    Clique para selecionar uma foto clara do seu cabelo para análise
                  </p>
                  <div 
                    className="px-6 py-3 rounded-xl font-semibold text-white"
                    style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)` }}
                  >
                    Selecionar Foto
                  </div>
                </div>
              </label>
            ) : (
              <div className="space-y-6">
                <div className="relative rounded-2xl overflow-hidden">
                  <img
                    src={selectedImage}
                    alt="Preview"
                    className="w-full h-auto max-h-96 object-cover"
                  />
                </div>
                
                <div className="flex gap-4">
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <div className="w-full px-6 py-3 rounded-xl border border-white/20 text-center font-semibold hover:bg-white/5 transition-colors">
                      Trocar Foto
                    </div>
                  </label>
                  
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="flex-1 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)` }}
                  >
                    {isAnalyzing ? (
                      <span className="flex items-center justify-center gap-2">
                        <Sparkles className="w-5 h-5 animate-spin" />
                        Analisando...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Analisar Agora
                        <ArrowRight className="w-5 h-5" />
                      </span>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" style={{ color: accentColor }} />
              Dicas para uma boa foto
            </h3>
            <ul className="space-y-2 text-white/60">
              <li className="flex items-start gap-2">
                <span style={{ color: accentColor }}>•</span>
                <span>Use luz natural ou ambiente bem iluminado</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: accentColor }}>•</span>
                <span>Cabelo limpo e penteado naturalmente</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: accentColor }}>•</span>
                <span>Foto de frente ou de perfil, mostrando todo o cabelo</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: accentColor }}>•</span>
                <span>Evite filtros ou edições na imagem</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
