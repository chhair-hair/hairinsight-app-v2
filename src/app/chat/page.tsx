'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/custom/navbar';
import { MessageCircle, Send, Sparkles, Loader2 } from 'lucide-react';
import { useQuiz } from '@/lib/quiz-context';

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

export default function ChatPage() {
  const { quizData, getThemeColors } = useQuiz();
  const colors = getThemeColors();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: 'Olá! Sou seu assistente de cuidados capilares. Como posso ajudar você hoje?',
      sender: 'bot',
      timestamp: '',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Fix hydration mismatch by setting timestamp only on client
  useEffect(() => {
    setMounted(true);
    setMessages(prev => prev.map(msg => ({
      ...msg,
      timestamp: msg.timestamp || new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    })));
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      content: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // TODO: Integrate with OpenAI API
    setTimeout(() => {
      const botMessage: Message = {
        id: messages.length + 2,
        content: 'Entendi sua pergunta! Em breve terei uma resposta personalizada para você. (Integração com OpenAI em desenvolvimento)',
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const suggestedQuestions = [
    'Como identificar meu tipo de cabelo?',
    'Qual a frequência ideal de hidratação?',
    'Como fazer cronograma capilar?',
    'Dicas para cabelos danificados',
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-6 px-4 sm:px-6 lg:px-8 flex flex-col">
        <div className="max-w-4xl w-full mx-auto flex flex-col flex-1">
          {/* Header */}
          <div className="mb-6">
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border mb-4"
              style={{ borderColor: `${colors.primary}30` }}
            >
              <MessageCircle className="w-4 h-4" style={{ color: colors.primary }} />
              <span className="text-sm text-white/80">Chat Inteligente</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Assistente <span style={{ color: colors.primary }}>Virtual</span>
            </h1>
            <p className="text-lg text-white/60">
              Tire suas dúvidas sobre cuidados capilares 24/7
            </p>
          </div>

          {/* Chat Container */}
          <div className="flex-1 rounded-3xl border border-white/10 bg-white/5 overflow-hidden flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 ${
                      message.sender === 'user'
                        ? 'text-white'
                        : 'bg-white/10 border border-white/10'
                    }`}
                    style={
                      message.sender === 'user'
                        ? { background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})` }
                        : {}
                    }
                  >
                    {message.sender === 'bot' && (
                      <div className="flex items-center gap-2 mb-2">
                        <div 
                          className="w-6 h-6 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${colors.primary}30` }}
                        >
                          <Sparkles className="w-4 h-4" style={{ color: colors.primary }} />
                        </div>
                        <span className="text-xs font-medium text-white/60">HairInsight AI</span>
                      </div>
                    )}
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    {mounted && message.timestamp && (
                      <span className="text-xs text-white/40 mt-2 block">
                        {message.timestamp}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/10 border border-white/10 rounded-2xl p-4">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" style={{ color: colors.primary }} />
                      <span className="text-sm text-white/60">Digitando...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Suggested Questions */}
            {messages.length === 1 && (
              <div className="px-6 pb-4">
                <p className="text-sm text-white/60 mb-3">Perguntas sugeridas:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setInputMessage(question)}
                      className="text-left px-4 py-3 rounded-xl border border-white/10 text-sm hover:bg-white/5 transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="border-t border-white/10 p-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Digite sua pergunta..."
                  className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/20 focus:outline-none transition-colors"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})` }}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
