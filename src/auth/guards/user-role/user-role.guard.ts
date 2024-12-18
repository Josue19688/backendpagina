import { CanActivate, ExecutionContext, Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators/role-protected/role-protected.decorator';
import { Usuario } from 'src/auth/entities/auth.entity';


@Injectable()
export class UserRoleGuard implements CanActivate {


  constructor(
    private readonly reflector:Reflector
  ){}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {


    const validRoles:string[] = this.reflector.get(META_ROLES,context.getHandler());

    if(!validRoles) return true;
    if(validRoles.length===0) return true;
    
    const req = context.switchToHttp().getRequest();
    const user = req.user as Usuario;
    if(!user) throw new BadRequestException('User not found.');

    for (const role of user.roles) {
      if(validRoles.includes(role)){
        return true;
      }
    }


    throw new ForbiddenException(
      `User ${user.nombre} need a valid role`
    )

    
  }
}
