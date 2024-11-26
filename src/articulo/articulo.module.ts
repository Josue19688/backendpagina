import { Module } from '@nestjs/common';
import { ArticuloService } from './articulo.service';
import { ArticuloController } from './articulo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Articulo } from './entities/articulo.entity';

@Module({
  controllers: [ArticuloController],
  providers: [ArticuloService],
  imports:[
    TypeOrmModule.forFeature([Articulo]),
    AuthModule
  ],
  exports:[
    ArticuloService,
    TypeOrmModule,
   
  ]
})
export class ArticuloModule {}
