import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function SemAcessoPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Acesso Negado</CardTitle>
          <CardDescription>
            Você não tem acesso a esta área premium
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Para acessar este conteúdo exclusivo, você precisa adquirir o produto.
          </p>

          <div className="bg-muted p-4 rounded-lg space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Como obter acesso:
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Compre o produto através da Hotmart</li>
              <li>Use o mesmo email da compra para acessar</li>
              <li>Seu acesso será liberado automaticamente</li>
            </ul>
          </div>

          <div className="flex gap-2">
            <Button asChild className="flex-1">
              <Link href="/">
                Voltar ao Início
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href="/planos-masculinos">
                Ver Planos
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
