'use server';

import { createServerAction } from 'zsa';
import { DashboardService } from '@/services/dashboardService';
import { UsersService } from '@/services/usersService';
import { cookies } from 'next/headers';

export const getDashboardStats = createServerAction().handler(async () => {
  const token = cookies().get('token')?.value;

  if (!token) {
    throw new Error('Unauthorized - No token provided');
  }

  try {
    const usersService = new UsersService();
    const user = await usersService.verifyToken(token);

    if (!user || user.id !== 688754) {
      throw new Error('Unauthorized - Invalid token');
    }

    // For now, we'll allow any authenticated user to access dashboard
    // You can add specific user ID checks here if needed
    const dashboardService = new DashboardService();
    const stats = await dashboardService.getDashboardStats();

    return stats;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw new Error('Failed to fetch dashboard statistics');
  }
});
