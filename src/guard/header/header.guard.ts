import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { getGuardReqRes } from '../utils';

const whitePathSet = new Set([
  '/api/auth/login',
  '/api/auth/register',
])

@Injectable()
export class HeaderGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const { req, res } = getGuardReqRes(context)
    if (!whitePathSet.has(req.path)) {
      if (!req.headers['authorization']) {
        res.status(401).send({ code: 401, message: '无权访问' })
        return false
      }
    }
    return true;
  }
}
