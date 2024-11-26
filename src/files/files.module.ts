import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { ArticuloModule } from 'src/articulo/articulo.module';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports:[
    ConfigModule,
    ArticuloModule,
    AuthModule
  ]
})
export class FilesModule {}
