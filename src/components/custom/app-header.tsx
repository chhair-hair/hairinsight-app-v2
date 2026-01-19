'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Calendar, MessageCircle } from 'lucide-react';

interface AppHeaderProps {
  accentColor?: string;
}

function AppHeader({ accentColor = '#667eea' }: AppHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0D0D0D]/95 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Nome à Esquerda */}
          <Link href="/app" className="flex items-center gap-2 group">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110"
              style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)` }}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              HairInsight
            </span>
          </Link>

          {/* Ícones Clicáveis à Direita */}
          <div className="flex items-center gap-3">
            {/* Ícone do Calendário */}
            <Link
              href="/schedule"
              className={`p-2.5 rounded-xl transition-all duration-300 hover:scale-110 ${
                pathname === '/schedule'
                  ? 'text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
              style={pathname === '/schedule' ? { backgroundColor: `${accentColor}30` } : {}}
              title="Calendário"
            >
              <Calendar
                className="w-6 h-6"
                style={pathname === '/schedule' ? { color: accentColor } : {}}
              />
            </Link>

            {/* Ícone do Chat */}
            <Link
              href="/chat"
              className={`p-2.5 rounded-xl transition-all duration-300 hover:scale-110 ${
                pathname === '/chat'
                  ? 'text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
              style={pathname === '/chat' ? { backgroundColor: `${accentColor}30` } : {}}
              title="Chat"
            >
              <MessageCircle
                className="w-6 h-6"
                style={pathname === '/chat' ? { color: accentColor } : {}}
              />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
