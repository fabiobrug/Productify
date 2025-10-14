// src/database.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { join } from 'path';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'sqlite',
      storage: join(process.cwd(), 'database.sqlite'), // Caminho para o arquivo do banco de dados
      autoLoadModels: true, // Carrega automaticamente os modelos
      synchronize: true,    // Sincroniza o schema com os modelos
    }),
  ],
})
export class DatabaseModule {}