'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { z } from 'zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useServerAction } from 'zsa-react';
import { useQueryClient } from '@tanstack/react-query';
import {
  CalendarIcon,
  User,
  Building2,
  UserCog,
  FlaskConical,
} from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@components/ui/form';
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@components/ui/popover';
import { Calendar } from '@components/ui/calendar';
import { useToast } from '@components/ui/use-toast';
import { cn } from '@lib/utils';
import { createCertificateSchema } from '@lib/validation-shemas/create-certificate';
import { createCertificate } from '@/app/certificados/novo/action';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select';
import { OperationLoadingOverlay } from '@components/ui/operation-loading-overlay';

export default function CreateCertificateForm({
  type,
}: {
  type: 'higienizacao' | 'impermeabilizacao';
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const form = useForm<z.infer<typeof createCertificateSchema>>({
    mode: 'all',
    resolver: zodResolver(createCertificateSchema),
    defaultValues: {
      type,
      product: null,
      clientName: '',
      companyName: '',
      technichalResponsible: '',
      date: undefined,
    },
  });

  const { execute, isPending } = useServerAction(createCertificate, {
    onError: ({ err }) => {
      setIsGenerating(false);
      toast({
        title: 'Erro ao criar certificado',
        description: err.message,
      });
    },
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ['getUser'] });
      toast({
        title: 'Certificado criado com sucesso',
        description: `O certificado foi criado com sucesso!`,
      });
      router.push(`/certificados/${data.certificateToken}`);
    },
  });
  const isSubmitting = isPending || isGenerating;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => {
          setIsGenerating(true);
          window.requestAnimationFrame(() => execute(values));
        })}
        className="space-y-6"
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="clientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Nome do cliente
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      className="pl-10"
                      placeholder="Digite o nome do cliente..."
                      disabled={isSubmitting}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel className="text-sm font-medium text-gray-700">
                  Data
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'flex w-full items-center justify-start gap-2 font-normal',
                          !field.value && 'text-muted-foreground',
                        )}
                        disabled={isSubmitting}
                      >
                        <CalendarIcon className="h-5 w-5 opacity-50" />
                        {field.value ? (
                          format(field.value, "d 'de' MMMM 'de' yyyy", {
                            locale: ptBR,
                          })
                        ) : (
                          <span className="text-gray-400">
                            Escolha uma data...
                          </span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => {
                        const today = new Date();
                        const sevenDaysAgo = new Date();
                        sevenDaysAgo.setDate(today.getDate() - 7);

                        return date > today || date < sevenDaysAgo;
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Nome da empresa
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Building2 className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      className="pl-10"
                      placeholder="Digite o nome da empresa..."
                      disabled={isSubmitting}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="technichalResponsible"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Técnico aplicador
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <UserCog className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      className="pl-10"
                      placeholder="Digite o nome do técnico..."
                      disabled={isSubmitting}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {type === 'impermeabilizacao' && (
            <FormField
              control={form.control}
              name="product"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Produto aplicado
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || undefined}
                    defaultValue={(field.value as string) || undefined}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3">
                          <FlaskConical className="h-5 w-5 text-gray-400" />
                        </div>
                        <SelectTrigger className="w-full pl-10">
                          <SelectValue placeholder="Selecione o produto..." />
                        </SelectTrigger>
                      </div>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Impertudo">Lótus Impertudo</SelectItem>
                      <SelectItem value="Safe">Lótus Safe</SelectItem>
                      <SelectItem value="Safe Tech">Lótus Safe Tech</SelectItem>
                      <SelectItem value="Eco">Lótus Eco</SelectItem>
                      <SelectItem value="Tech Block">
                        Lótus Tech Block
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="relative overflow-hidden bg-brand text-white hover:bg-brand/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Gerando certificado...</span>
              </div>
            ) : (
              'Emitir certificado'
            )}
          </Button>
        </div>
      </form>
      {isSubmitting && (
        <OperationLoadingOverlay
          title="Gerando certificado"
          description="Seu certificado está sendo criado. Isso pode levar alguns segundos; não feche esta tela."
        />
      )}
    </Form>
  );
}
