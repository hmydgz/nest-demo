import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getModelForClass, mongoose } from '@typegoose/typegoose';

type ClassType = { new (...args: any[]): any }

@Module({})
export class DbModule {
  static forRoot(envKey: string, options: mongoose.ConnectOptions = {}): DynamicModule {
    const _providers: Provider[] = [
      {
        provide: 'DB_CONNECT',
        inject: [ConfigService],
        useFactory: (config: ConfigService) => mongoose.connect(config.get<string>(envKey, 'MONGODB_URI'), options),
      },
    ]

    return {
      module: DbModule,
      providers: _providers,
      exports: _providers,
      global: true,
    }
  }

  static forFeature(models: ClassType[]): DynamicModule {
    const providers = models.map(v => ({
      provide: v.name,
      useFactory: () => getModelForClass(v),
    }))
    return {
      module: DbModule,
      providers,
      exports: providers,
      global: true,
    }
  }
}
