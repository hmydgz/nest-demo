import { DynamicModule, Module, Provider } from '@nestjs/common';
import { createClient } from 'redis'
import { ProvideEnum } from '@/common/enums/provide.enum';
import { ConfigService } from '@nestjs/config';


@Module({})
export class RedisModule {
  static forRoot(envKey = 'REDIS_PATH'): DynamicModule {
    const providers: Provider[] = [
      {
        provide: ProvideEnum.REDIS_CLIENT,
        inject: [ConfigService],
        useFactory: async (config: ConfigService) => {
          const client = createClient({
            url: config.get(envKey),
            // password: 'root',
            // password: 'asdasd',
          })
          await client.connect()
          return client
        },
      },
    ]

    return {
      module: RedisModule,
      providers: [...providers],
      exports: [...providers],
      global: true,
    }
  }
}
