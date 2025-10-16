// src/database.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production';
        
        // Configuração para PostgreSQL em produção/Docker
        if (isProduction || configService.get('DATABASE_HOST')) {
          return {
            dialect: 'postgres',
            host: configService.get('DATABASE_HOST', 'localhost'),
            port: configService.get('DATABASE_PORT', 5432),
            username: configService.get('DATABASE_USER', 'productify_user'),
            password: configService.get('DATABASE_PASSWORD', 'productify_password'),
            database: configService.get('DATABASE_NAME', 'productify'),
            autoLoadModels: true,
            synchronize: !isProduction, // Apenas em desenvolvimento
            logging: !isProduction,
            pool: {
              max: 5,
              min: 0,
              acquire: 30000,
              idle: 10000,
            },
          };
        }
        
        // Configuração para SQLite em desenvolvimento local
        return {
          dialect: 'sqlite',
          storage: 'database.sqlite',
          autoLoadModels: true,
          synchronize: true,
          logging: true,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}