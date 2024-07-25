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

const loginByClientIdSchema = z.object({
  clientId: z.string(),
});

export default function Home() {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof loginByClientIdSchema>>({
    mode: 'onChange',
    resolver: zodResolver(loginByClientIdSchema),
  });
  const { execute } = useServerAction(loginByClientId, {
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
    <section className="mx-auto flex h-full max-w-screen-xl gap-4 px-4 py-4 xl:px-0">
      <div className="hidden min-h-full w-1/2 bg-slate-400 md:flex">
        <div className="h-full w-full bg-brand p-4" />
      </div>
      <div className="flex min-h-full w-full flex-col items-end gap-4 md:w-1/2">
        <h2 className="text-2xl font-semibold">
          Sistemas de Certificados Digitais G&S
        </h2>
        <Form {...form}>
          <form
            className="flex w-full flex-col gap-4"
            onSubmit={form.handleSubmit((values) => {
              execute(values);
            })}
          >
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código do cliente:</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      className='[&::-webkit-outer-spin-button]:appearance-none" [appearance:textfield] focus-within:ring-2 [&::-webkit-inner-spin-button]:appearance-none'
                      placeholder="SEU CÓDIGO DO CLIENTE"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-1/3 self-end rounded-md bg-brand px-4 py-2 text-white"
            >
              Entrar
            </Button>
          </form>
        </Form>
      </div>
    </section>
  );
}
