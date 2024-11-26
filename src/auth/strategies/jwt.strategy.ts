import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Usuario } from "../entities/auth.entity";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){

    constructor(
        @InjectRepository(Usuario)
        private readonly userRepository:Repository<Usuario>,
        configService:ConfigService
    ){
        super({
            secretOrKey:configService.get('SECRET_KEY_JWT'),
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
        })
    }

    async validate (payload:JwtPayload):Promise<Usuario>{
        
        const {id} = payload;

        const user = await this.userRepository.findOneBy({id:id});

        if(!user) throw new UnauthorizedException('Token not valid!!');
       

        if(!user.activo) throw new UnauthorizedException('Usuario invalido token jjjjjjj!!');

        return user;
    }
}