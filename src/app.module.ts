import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesModule } from './files/files.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { PdfModule } from './pdf/pdf.module';
import { SearchModule } from './search/search.module';
import { ArticuloModule } from './articulo/articulo.module';


@Module({
  imports: [ 
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities:true,
      synchronize:true, ///solo para desarrollo en produccion cambiar a false
    }),
    
    FilesModule,
    AuthModule,
    EmailModule,
    PdfModule,
    SearchModule,
    ArticuloModule,
    
  ],
})
export class AppModule {}
