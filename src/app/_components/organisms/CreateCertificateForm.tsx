'use client';

import { z } from 'zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@components/ui/form';
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@components/ui/popover';
import { Calendar } from '@components/ui/calendar';
import { createCertificateSchema } from '@lib/validation-shemas/create-certificate';
import { cn } from '@lib/utils';
import { createCertificate } from '@/app/certificados/novo/action';

export default function CreateCertificateForm() {
  const form = useForm<z.infer<typeof createCertificateSchema>>({
    mode: 'onChange',
    resolver: zodResolver(createCertificateSchema),
  });

  const onSubmit = async (values: z.infer<typeof createCertificateSchema>) => {
    // TODO: Implement submit logic
    const response = await createCertificate(values);
    console.log(response);
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-screen-sm space-y-2"
      >
        <FormField
          control={form.control}
          name="clientName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do cliente:</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder="Digite o nome do cliente..."
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel>Data:</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-[240px] pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value ? (
                          // Show date in the form "1 de janeiro de 2022"
                          format(
                            new Date(field.value),
                            "d 'de' MMMM 'de' yyyy",
                            {
                              locale: ptBR,
                            },
                          )
                        ) : (
                          <span>Escolha uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da empresa:</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder="Digite o nome da sua empresa..."
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="technichalResponsible"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Responsável técnico:</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder="Digite o nome do responsável técnico..."
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormItem>
          <Button type="submit" disabled={!form.formState.isValid}>
            Emitir certificado
          </Button>
        </FormItem>
      </form>
    </Form>
  );
}
