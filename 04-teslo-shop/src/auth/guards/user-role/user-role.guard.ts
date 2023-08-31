import {BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable} from '@nestjs/common';
import { Observable } from 'rxjs';
import {Reflector} from "@nestjs/core";

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
      private readonly reflector: Reflector
  ) {
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.get<string[]>('roles', context.getHandler());

    if(!validRoles) {
        return true;
    }

    if(validRoles.length === 0) {
        return true;
    }

    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if(!user) {
      throw new BadRequestException('User not found');
    }

    for (const role of user.roles) {
      if(validRoles.includes(role)) {
        return true;
      }
    }

    throw new ForbiddenException('You do not have permission to access this resource');
  }
}
