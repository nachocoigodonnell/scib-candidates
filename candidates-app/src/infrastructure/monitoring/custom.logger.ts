import {ConsoleLogger, Injectable, LogLevel} from '@nestjs/common';

@Injectable()
export class CustomLogger extends ConsoleLogger {
    private readonly allowed = this.getAllowedLogLevels();

    private getAllowedLogLevels(): LogLevel[] {
        const order: LogLevel[] = ['error', 'warn', 'log', 'debug', 'verbose'];
        const env = (process.env.LOG_LEVEL ?? 'log') as LogLevel;
        const idx = order.indexOf(env);
        return idx >= 0 ? order.slice(0, idx + 1) : ['error', 'warn', 'log'];
    }

    private formatLog(level: LogLevel, msg: any, ctx?: string, stack?: string): string {
        const timestamp = new Date().toISOString();
        const context = ctx ?? this.context ?? '';
        const message = typeof msg === 'string' ? msg : JSON.stringify(msg);

        // Always use JSON format for consistent parsing in Loki
        return JSON.stringify({
            timestamp,
            level: level.toUpperCase(),
            context,
            message,
            ...(stack && { stack }),
            pid: process.pid
        });
    }

    private out(level: LogLevel, line: string) {
        if (!this.allowed.includes(level)) return;
        (level === 'error' ? console.error : console.log)(line);
    }

    // Public methods (one per level)
    log(msg: any, ctx?: string) {
        this.out('log', this.formatLog('log', msg, ctx));
    }

    warn(msg: any, ctx?: string) {
        this.out('warn', this.formatLog('warn', msg, ctx));
    }

    debug(msg: any, ctx?: string) {
        this.out('debug', this.formatLog('debug', msg, ctx));
    }

    verbose(msg: any, ctx?: string) {
        this.out('verbose', this.formatLog('verbose', msg, ctx));
    }

    error(msg: any, stack?: string, ctx?: string) {
        this.out('error', this.formatLog('error', msg, ctx, stack));
    }
}
