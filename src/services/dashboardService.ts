import type { IDashboardRepository } from '@/repositories';
import { DashboardRepository } from '@/repositories/dashboardRepository';

export interface DashboardStats {
  totalCertificates: number;
  uniqueUsersWithCertificates: number;
  totalUsers: number;
}

export class DashboardService {
  private dashboardRepository: IDashboardRepository;

  constructor() {
    this.dashboardRepository = new DashboardRepository();
  }

  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const [totalCertificates, uniqueUsersWithCertificates, totalUsers] =
        await Promise.all([
          this.dashboardRepository.getTotalCertificates(),
          this.dashboardRepository.getUniqueUsersWithCertificates(),
          this.dashboardRepository.getTotalUsers(),
        ]);

      return {
        totalCertificates,
        uniqueUsersWithCertificates,
        totalUsers,
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw new Error('Failed to fetch dashboard statistics');
    }
  }

  async getTotalCertificates(): Promise<number> {
    try {
      return await this.dashboardRepository.getTotalCertificates();
    } catch (error) {
      console.error('Error fetching total certificates:', error);
      throw new Error('Failed to fetch total certificates');
    }
  }

  async getUniqueUsersWithCertificates(): Promise<number> {
    try {
      return await this.dashboardRepository.getUniqueUsersWithCertificates();
    } catch (error) {
      console.error('Error fetching unique users with certificates:', error);
      throw new Error('Failed to fetch unique users with certificates');
    }
  }

  async getTotalUsers(): Promise<number> {
    try {
      return await this.dashboardRepository.getTotalUsers();
    } catch (error) {
      console.error('Error fetching total users:', error);
      throw new Error('Failed to fetch total users');
    }
  }
}
