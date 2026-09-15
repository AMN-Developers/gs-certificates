import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { requireSystemOwnerAdmin } from '../_admin-auth';

type AdminUsersLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default async function AdminUsersLayout({
  children,
}: AdminUsersLayoutProps) {
  if (!(await requireSystemOwnerAdmin())) {
    redirect('/dashboard');
  }

  return children;
}
