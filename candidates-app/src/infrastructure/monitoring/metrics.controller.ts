import { Controller, Get, Header } from '@nestjs/common';
import { BusinessMetricsService } from './business-metrics.service';

@Controller('metrics')
export class MetricsController {
  constructor(
    private readonly businessMetricsService: BusinessMetricsService
  ) {}

  @Get()
  @Header('Content-Type', 'text/plain; version=0.0.4; charset=utf-8')
  async getMetrics(): Promise<string> {
    return await this.businessMetricsService.getMetrics();
  }
}