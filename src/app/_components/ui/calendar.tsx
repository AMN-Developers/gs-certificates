'use client';

import * as React from 'react';
import { ptBR } from 'date-fns/locale/pt-BR';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react';
import { DayPicker } from 'react-day-picker';

import { cn } from '@lib/utils';
import { buttonVariants } from '@/app/_components/ui/button';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        root: 'w-fit rounded-lg',
        months: 'relative flex flex-col gap-4 sm:flex-row',
        month: 'flex w-[280px] flex-col gap-2',
        month_caption: 'relative flex h-9 items-center justify-center',
        caption_label: 'text-sm font-medium',
        nav: 'absolute inset-x-0 top-0 flex items-center justify-between',
        button_previous: cn(
          buttonVariants({ variant: 'outline' }),
          'h-8 w-8 bg-transparent p-0 opacity-70 hover:opacity-100',
        ),
        button_next: cn(
          buttonVariants({ variant: 'outline' }),
          'h-8 w-8 bg-transparent p-0 opacity-70 hover:opacity-100',
        ),
        month_grid: 'w-full table-fixed border-collapse',
        weekdays: '',
        weekday: 'h-9 w-10 text-center text-xs font-normal text-slate-500',
        week: '',
        day: 'relative h-10 w-10 p-0 text-center text-sm',
        day_button: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-10 w-10 p-0 font-normal aria-selected:opacity-100',
        ),
        selected:
          'bg-slate-900 text-slate-50 hover:bg-slate-900 hover:text-slate-50 focus:bg-slate-900 focus:text-slate-50 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50 dark:hover:text-slate-900 dark:focus:bg-slate-50 dark:focus:text-slate-900',
        today:
          'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50',
        outside: 'text-slate-400 opacity-50',
        disabled: 'cursor-not-allowed text-slate-400 opacity-40 hover:bg-transparent',
        range_middle:
          'aria-selected:bg-slate-100 aria-selected:text-slate-900 dark:aria-selected:bg-slate-800 dark:aria-selected:text-slate-50',
        hidden: 'invisible',
        ...classNames,
      }}
      locale={ptBR}
      components={{
        Chevron: ({ orientation }) => {
          if (orientation === 'left') return <ChevronLeft className="h-4 w-4" />;
          if (orientation === 'up') return <ChevronUp className="h-4 w-4" />;
          if (orientation === 'down') return <ChevronDown className="h-4 w-4" />;
          return <ChevronRight className="h-4 w-4" />;
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
