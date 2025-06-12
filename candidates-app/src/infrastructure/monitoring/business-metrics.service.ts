import { Injectable } from '@nestjs/common';
import { Counter, register, Registry } from 'prom-client';

@Injectable()
export class BusinessMetricsService {
  private candidatesCreatedCounter: Counter<string>;
  private businessRegistry: Registry;

  constructor() {
    // Create a new registry for business metrics
    this.businessRegistry = new Registry();
    
    // Metric for tracking candidate creation
    this.candidatesCreatedCounter = new Counter({
      name: 'candidates_created_total',
      help: 'Total number of candidates created',
      labelNames: ['seniority', 'availability'],
      registers: [this.businessRegistry, register], // Register in both registries
    });
  }

  incrementCandidatesCreated(seniority: string, availability: boolean) {
    this.candidatesCreatedCounter.inc({
      seniority: seniority.toLowerCase(),
      availability: availability.toString(),
    });
  }

  async getMetrics(): Promise<string> {
    return register.metrics();
  }
}