'use client';

import { useState, useEffect, useRef } from 'react';
import AppHeader from '@/components/custom/app-header';
import { MessageCircle, Send, Sparkles, Loader2, Trash2 } from 'lucide-react';
import { useQuiz } from '@/lib/quiz-context';
import { Gender } from '@/lib/types';

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

export default function ChatPage() {
  const { quizData } = useQuiz();
  const gender: Gender = quizData?.gender || 'feminino';
  const accentColor = gender === 'feminino' ? '#FF6F91' : '#9B59B6';
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: 'Olá! Que bom te ver por aqui! 💕\n\nSou sua assistente pessoal de cuidados capilares e estou aqui para te ajudar a cuidar melhor dos seus cabelos. Seja para tirar dúvidas, descobrir sua rotina ideal ou receber dicas personalizadas, pode contar comigo!\n\nComo posso te ajudar hoje?',
      sender: 'bot',
      timestamp: '',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Carregar histórico do localStorage e fix hydration mismatch
  useEffect(() => {
    setMounted(true);

    // Tentar carregar histórico salvo
    try {
      const savedHistory = localStorage.getItem('hairinsight-chat-history');
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        if (Array.isArray(parsedHistory) && parsedHistory.length > 0) {
          setMessages(parsedHistory);
          return;
        }
      }
    } catch (error) {
      console.error('Erro ao carregar histórico do chat:', error);
    }

    // Se não houver histórico, adiciona timestamp à mensagem inicial
    setMessages(prev => prev.map(msg => ({
      ...msg,
      timestamp: msg.timestamp || new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    })));
  }, []);

  // Salvar histórico no localStorage sempre que as mensagens mudarem
  useEffect(() => {
    if (mounted && messages.length > 0) {
      try {
        localStorage.setItem('hairinsight-chat-history', JSON.stringify(messages));
      } catch (error) {
        console.error('Erro ao salvar histórico do chat:', error);
      }
    }
  }, [messages, mounted]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage: Message = {
      id: messages.length + 1,
      content: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          gender: gender,
          hairType: quizData?.hairType,
          hairGoal: quizData?.hairGoal,
          washFrequency: quizData?.washFrequency,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao comunicar com a API');
      }

      const data = await response.json();

      const botMessage: Message = {
        id: messages.length + 2,
        content: data.message,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      const errorMessage: Message = {
        id: messages.length + 2,
        content: 'Desculpe, tive um problema ao processar sua mensagem. Por favor, tente novamente.',
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const suggestedQuestions = [
    'Como identificar meu tipo de cabelo?',
    'Qual a frequência ideal de hidratação?',
    'Como fazer cronograma capilar?',
    'Dicas para cabelos danificados',
    'Como evitar pontas duplas?',
    'Melhor forma de secar o cabelo?',
  ];

  const clearHistory = () => {
    if (confirm('Deseja realmente limpar todo o histórico do chat?')) {
      const initialMessage: Message = {
        id: 1,
        content: 'Olá! Que bom te ver por aqui! 💕\n\nSou sua assistente pessoal de cuidados capilares e estou aqui para te ajudar a cuidar melhor dos seus cabelos. Seja para tirar dúvidas, descobrir sua rotina ideal ou receber dicas personalizadas, pode contar comigo!\n\nComo posso te ajudar hoje?',
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([initialMessage]);
      try {
        localStorage.removeItem('hairinsight-chat-history');
      } catch (error) {
        console.error('Erro ao limpar histórico:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col">
      <AppHeader accentColor={accentColor} />

      <main className="flex-1 pt-24 pb-6 px-4 sm:px-6 lg:px-8 flex flex-col">
        <div className="max-w-4xl w-full mx-auto flex flex-col flex-1">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border"
                style={{ borderColor: `${accentColor}30` }}
              >
                <MessageCircle className="w-4 h-4" style={{ color: accentColor }} />
                <span className="text-sm text-white/80">Chat com IA</span>
              </div>

              {messages.length > 1 && (
                <button
                  onClick={clearHistory}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm text-white/60 hover:text-white/80"
                  title="Limpar histórico"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Limpar histórico</span>
                </button>
              )}
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Assistente <span style={{ color: accentColor }}>Virtual</span>
            </h1>
            <p className="text-lg text-white/60">
              Sua assistente pessoal disponível 24 horas por dia
            </p>
          </div>

          {/* Chat Container */}
          <div className="flex-1 rounded-3xl border border-white/10 bg-white/5 overflow-hidden flex flex-col min-h-0">
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
                        ? { background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)` }
                        : {}
                    }
                  >
                    {message.sender === 'bot' && (
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-6 h-6 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${accentColor}30` }}
                        >
                          <Sparkles className="w-4 h-4" style={{ color: accentColor }} />
                        </div>
                        <span className="text-xs font-medium text-white/60">HairInsight AI</span>
                      </div>
                    )}
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
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
                      <Loader2 className="w-4 h-4 animate-spin" style={{ color: accentColor }} />
                      <span className="text-sm text-white/60">Pensando...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
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
                  className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/20 focus:outline-none transition-colors text-white placeholder:text-white/40"
                  disabled={isTyping}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)` }}
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
