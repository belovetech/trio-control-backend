import { Module } from '@nestjs/common';
import { LoggerModule as AppLoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    AppLoggerModule.forRoot({
      pinoHttp: {
        customProps: (req, res) => ({
          context: 'HTTP',
        }),
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
      },
    }),
  ],
})
export class LoggerModule {}
