'use client';

import { useState } from 'react';
import { AccessGuard } from '@/components/AccessGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Sparkles } from 'lucide-react';

export default function PremiumPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
    }
  };

  // Antes de verificar o acesso, mostra o formulário de email
  if (!isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Área Premium</CardTitle>
            <CardDescription>
              Digite seu email de compra para acessar o conteúdo exclusivo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email de Compra</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Verificar Acesso
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Depois que o email foi informado, verifica o acesso
  return (
    <AccessGuard userEmail={email} fallbackUrl="/sem-acesso">
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              Área Premium
            </div>
            <h1 className="text-4xl font-bold">Bem-vindo ao Conteúdo Exclusivo!</h1>
            <p className="text-muted-foreground text-lg">
              Você tem acesso a todos os recursos premium
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recurso Premium 1</CardTitle>
                <CardDescription>
                  Conteúdo exclusivo para membros
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Este é um exemplo de conteúdo premium que só está disponível
                  para usuários que compraram o produto.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recurso Premium 2</CardTitle>
                <CardDescription>
                  Mais benefícios exclusivos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Aqui você pode adicionar funcionalidades, conteúdos,
                  ferramentas e muito mais para seus clientes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recurso Premium 3</CardTitle>
                <CardDescription>
                  Acesso ilimitado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Seu acesso foi validado através da Hotmart e você pode
                  aproveitar todo o conteúdo sem limitações.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recurso Premium 4</CardTitle>
                <CardDescription>
                  Suporte prioritário
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Como membro premium, você tem acesso a suporte prioritário
                  e atualizações exclusivas.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AccessGuard>
  );
}
