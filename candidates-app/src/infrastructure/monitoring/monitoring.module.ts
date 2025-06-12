import { Module, Global } from '@nestjs/common';
import { MetricsController } from './metrics.controller';
import { BusinessMetricsService } from './business-metrics.service';

@Global()
@Module({
  providers: [BusinessMetricsService],
  controllers: [MetricsController],
  exports: [BusinessMetricsService],
})
export class MonitoringModule {}