import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/auth.entity';
import { ImagenUsuario } from './entities/user-image.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { EmailModule } from 'src/email/email.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy],
  imports: [
    ConfigModule,
    EmailModule,
    TypeOrmModule.forFeature([Usuario, ImagenUsuario]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('SECRET_KEY_JWT'),
          signOptions: {
            expiresIn: '2h'
          }
        }
      }
    })
  ],
  exports: [
    TypeOrmModule,
    JwtStrategy,
    PassportModule,
    JwtModule,
    AuthService
  ]
})
export class AuthModule {}
