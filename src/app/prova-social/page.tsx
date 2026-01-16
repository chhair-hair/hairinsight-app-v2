"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export default function ProvaSocialPage() {
  const router = useRouter();

  const transformations = [
    {
      id: 1,
      profile: "Cabelo ondulado danificado",
      description: "Recuperação completa da hidratação e brilho natural em 60 dias",
      beforeImage: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=400&h=500&fit=crop",
      afterImage: "https://images.unsplash.com/photo-1595475884562-073c30d45670?w=400&h=500&fit=crop",
    },
    {
      id: 2,
      profile: "Cabelo cacheado ressecado",
      description: "Definição dos cachos e redução de 90% do frizz em 45 dias",
      beforeImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop",
      afterImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop",
    },
    {
      id: 3,
      profile: "Cabelo liso sem volume",
      description: "Aumento de volume e fortalecimento visível em 30 dias",
      beforeImage: "https://images.unsplash.com/photo-1605462863863-10d9e47e15ee?w=400&h=500&fit=crop",
      afterImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
    },
  ];

  const testimonials = [
    {
      id: 1,
      text: "Minha autoestima mudou completamente após seguir a rotina. Nunca pensei que teria tanto resultado em pouco tempo.",
    },
    {
      id: 2,
      text: "A análise da IA foi certeira, meu cabelo mudou em 30 dias.",
    },
    {
      id: 3,
      text: "O antes e depois fala por si só. Recomendo 100%.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            Transformações{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Reais
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
            Veja os resultados de quem seguiu rotinas capilares personalizadas
          </p>
        </motion.div>

        {/* Antes e Depois Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-20"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-4xl font-bold text-white text-center mb-12"
          >
            Antes & Depois
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {transformations.map((transformation) => (
              <motion.div
                key={transformation.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300"
              >
                <div className="grid grid-cols-2 gap-2 p-4">
                  <motion.div
                    className="relative overflow-hidden rounded-lg"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={transformation.beforeImage}
                      alt="Antes"
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-red-500/90 text-white text-xs font-bold px-2 py-1 rounded">
                      ANTES
                    </div>
                  </motion.div>
                  <motion.div
                    className="relative overflow-hidden rounded-lg"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={transformation.afterImage}
                      alt="Depois"
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-green-500/90 text-white text-xs font-bold px-2 py-1 rounded">
                      DEPOIS
                    </div>
                  </motion.div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-2">
                    {transformation.profile}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {transformation.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Depoimentos Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-16"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-4xl font-bold text-white text-center mb-12"
          >
            O Que Dizem Nossos Usuários
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                variants={itemVariants}
                whileHover={{ scale: 1.03 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300"
              >
                <p className="text-gray-300 leading-relaxed italic">
                  "{testimonial.text}"
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-2xl border border-white/10 p-8 sm:p-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Pronto para Sua Transformação?
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Escolha o plano ideal e comece sua jornada rumo a cabelos mais saudáveis
            </p>
            <motion.button
              onClick={() => router.push("/planos")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-8 py-4 rounded-full text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg shadow-purple-500/50"
            >
              Continuar para o próximo passo
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
