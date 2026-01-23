'use client';

import { useState, useRef, useEffect } from 'react';
import AppHeader from '@/components/custom/app-header';
import { MessageCircle, Send, Sparkles, Loader2, User, Bot } from 'lucide-react';
import { useQuiz } from '@/lib/quiz-context';
import { Gender } from '@/lib/types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const { quizData } = useQuiz();
  const gender: Gender = quizData?.gender || 'feminino';
  const accentColor = gender === 'feminino' ? '#FF6F91' : '#9B59B6';

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Olá! 👋 Sou sua assistente especializada em cuidados capilares.\n\nVi que seu cabelo é ${quizData?.hairType || 'único'} e seu objetivo é ${quizData?.hairGoal?.replace('-', ' ') || 'ter cabelos saudáveis'}. Estou aqui para te ajudar!\n\nComo posso te auxiliar hoje? 💇‍♀️`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          quizData
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao enviar mensagem');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('[Chat] Erro:', error);

      const errorMessage: Message = {
        role: 'assistant',
        content: `Desculpe, ocorreu um erro: ${error.message}\n\nPor favor, tente novamente. Se o erro persistir, verifique se a OpenAI API Key está configurada corretamente.`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQuestions = [
    'Como identificar meu tipo de cabelo?',
    'Qual a frequência ideal de hidratação?',
    'Como fazer cronograma capilar?',
    'Dicas para cabelos danificados',
  ];

  const handleSuggestionClick = (question: string) => {
    setInput(question);
    inputRef.current?.focus();
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col">
      <AppHeader accentColor={accentColor} />

      <main className="flex-1 flex flex-col pt-16 pb-4">
        <div className="max-w-4xl w-full mx-auto flex flex-col flex-1 px-4">
          {/* Header */}
          <div className="py-6 border-b border-white/10">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border mb-3"
              style={{ borderColor: `${accentColor}30` }}
            >
              <Sparkles className="w-4 h-4" style={{ color: accentColor }} />
              <span className="text-sm text-white/80">Chat com IA</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              Assistente <span style={{ color: accentColor }}>Virtual</span>
            </h1>
            <p className="text-white/60">
              Tire suas dúvidas sobre cuidados capilares com IA especializada
            </p>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto py-6 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${accentColor}20` }}
                  >
                    <Bot className="w-5 h-5" style={{ color: accentColor }} />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'text-white'
                      : 'bg-white/5 text-white/90'
                  }`}
                  style={
                    message.role === 'user'
                      ? { background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)` }
                      : {}
                  }
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <span className="text-xs opacity-60 mt-2 block">
                    {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {message.role === 'user' && (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${accentColor}20` }}
                  >
                    <User className="w-5 h-5" style={{ color: accentColor }} />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${accentColor}20` }}
                >
                  <Bot className="w-5 h-5" style={{ color: accentColor }} />
                </div>
                <div className="bg-white/5 rounded-2xl px-4 py-3">
                  <Loader2 className="w-5 h-5 animate-spin" style={{ color: accentColor }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions (only show if no messages from user yet) */}
          {messages.filter(m => m.role === 'user').length === 0 && (
            <div className="pb-4">
              <p className="text-sm text-white/60 mb-2">Sugestões:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(question)}
                    className="text-xs px-3 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="py-4 border-t border-white/10">
            <div className="flex gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Digite sua dúvida sobre cabelos..."
                disabled={isLoading}
                rows={1}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/20 resize-none"
                style={{ maxHeight: '120px' }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)` }}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-white/40 mt-2">
              Pressione Enter para enviar • Shift+Enter para nova linha
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
