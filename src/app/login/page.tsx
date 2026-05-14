import { signIn } from '@/auth';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { Baby } from 'lucide-react';

import { LoginForm } from '@/components/LoginForm';

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) {
    redirect(session.user.role === 'USER' ? '/' : '/admin');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-baby-rose/20 via-baby-white to-baby-mint/20 px-4">
      <div className="w-full max-w-md">
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-baby-rose to-baby-mint mb-4">
              <Baby className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Baby Star</h1>
            <p className="text-gray-500 mt-1">Inicia sesión en tu cuenta</p>
          </div>

          <LoginForm />

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Ingresa tus credenciales de administrador</p>
          </div>
        </div>
      </div>
    </div>
  );
}