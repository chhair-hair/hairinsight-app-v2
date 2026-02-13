'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface AccessGuardProps {
  children: React.ReactNode;
  userEmail: string;
  productId?: string;
  fallbackUrl?: string;
}

/**
 * Componente client-side para proteger conteúdo premium
 * Verifica se o usuário tem acesso baseado no email
 */
export function AccessGuard({
  children,
  userEmail,
  productId,
  fallbackUrl = '/sem-acesso',
}: AccessGuardProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    async function checkAccess() {
      try {
        const params = new URLSearchParams();
        params.set('email', userEmail);
        if (productId) {
          params.set('productId', productId);
        }

        const response = await fetch(`/api/check-access?${params.toString()}`);
        const data = await response.json();

        if (data.hasAccess) {
          setHasAccess(true);
        } else {
          router.push(fallbackUrl);
        }
      } catch (error) {
        console.error('Erro ao verificar acesso:', error);
        router.push(fallbackUrl);
      } finally {
        setIsChecking(false);
      }
    }

    if (userEmail) {
      checkAccess();
    } else {
      router.push(fallbackUrl);
    }
  }, [userEmail, productId, fallbackUrl, router]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Verificando seu acesso...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return null;
  }

  return <>{children}</>;
}
