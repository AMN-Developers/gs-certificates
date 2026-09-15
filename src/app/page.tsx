'use client';

import { useRouter } from 'next/navigation';
import { useServerAction } from 'zsa-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@components/ui/form';
import { useToast } from '@components/ui/use-toast';
import { loginByClientId } from './action';
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import { KeyRound, LogIn } from 'lucide-react';
import Image from 'next/image';
import logo from '@assets/logo.svg';

const loginByClientIdSchema = z.object({
  clientId: z
    .string()
    .min(1, 'Código do cliente é obrigatório')
    .regex(/^\d+$/, 'Código do cliente deve conter apenas números'),
});

export default function Home() {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof loginByClientIdSchema>>({
    mode: 'onChange',
    resolver: zodResolver(loginByClientIdSchema),
  });

  const { execute, isPending } = useServerAction(loginByClientId, {
    onSuccess: () => {
      toast({
        title: 'Usuário logado com sucesso',
        description: `O usuário foi logado com sucesso!`,
      });
      router.push('/certificados/');
    },
    onError: ({ err }) => {
      toast({
        title: 'Erro ao logar',
        description: err.message,
      });
    },
  });

  return (
    <section className="mx-auto flex min-h-[calc(100vh-10rem)] w-full max-w-screen-xl items-center justify-center px-4 py-8 xl:px-0">
      <div className="grid w-full gap-8 lg:grid-cols-2">
        {/* Left Side - Hero Section */}
        <div className="hidden flex-col justify-center space-y-6 lg:flex">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gradient-to-br from-brand to-[#1a237e] p-8">
            {/* Decorative Elements */}
            <div className="absolute inset-0 bg-pattern-waves bg-cover bg-center opacity-10" />
            <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
              <Image
                src={logo}
                alt="G&S Home Solutions Logo"
                width={200}
                height={200}
                className="mb-6"
                priority
              />
              <h1 className="mb-4 text-3xl font-bold text-white">
                Sistema de Certificados Digitais
              </h1>
              <p className="text-lg text-white/90">
                Gerencie e emita seus certificados de forma rápida e segura
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex items-center justify-center lg:justify-start">
          <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                Bem-vindo de volta
              </h2>
              <p className="text-sm text-gray-500">
                Digite seu código de cliente para acessar o sistema
              </p>
            </div>

            <Form {...form}>
              <form
                className="space-y-6"
                onSubmit={form.handleSubmit((values) => {
                  execute(values);
                })}
              >
                <FormField
                  control={form.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Código do cliente
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <KeyRound className="h-5 w-5 text-gray-400" />
                          </div>
                          <Input
                            {...field}
                            type="number"
                            className="block w-full rounded-lg border-gray-300 pl-10 [appearance:textfield] focus:border-brand focus:ring-brand sm:text-sm [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            placeholder="Digite seu código..."
                            disabled={isPending}
                          />
                        </div>
                      </FormControl>
                      {form.formState.errors.clientId && (
                        <p className="mt-1 text-sm text-red-500">
                          {form.formState.errors.clientId.message}
                        </p>
                      )}
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="relative w-full overflow-hidden rounded-lg bg-brand py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={isPending || !form.formState.isValid}
                >
                  {isPending ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Entrando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>Entrar</span>
                      <LogIn className="h-4 w-4" />
                    </div>
                  )}
                </Button>
              </form>
            </Form>

            {/* Additional Info */}
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Em caso de problemas, entre em contato com o suporte
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
