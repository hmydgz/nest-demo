import { CanActivate, ExecutionContext, Inject, Injectable, SetMetadata } from '@nestjs/common';
import { Observable } from 'rxjs';
import { getGuardReqRes } from '../utils';
import { Reflector } from '@nestjs/core';
import { MetadataKeyEnum } from '@/common/enums/metadata-key.enum';

const whitePathSet = new Set([
  '/api/auth/login',
  '/api/auth/register',
])

@Injectable()
export class HeaderGuard implements CanActivate {
  constructor(
    @Inject(Reflector) private readonly reflector?: Reflector
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const { req, res } = getGuardReqRes(context)

    const isSkip = !!this.reflector.getAllAndOverride<boolean | undefined>(
      MetadataKeyEnum.SKIP_HEADER_GUARD,
      [context.getHandler(), context.getClass()],
    )

    if (!whitePathSet.has(req.path) && !isSkip) {
      if (!req.headers['authorization']) {
        res.status(401).send({ code: 401, message: '无权访问' })
        return false
      }
    }
    return true;
  }
}

export function SkipHeaderGuard() {
  return SetMetadata(MetadataKeyEnum.SKIP_HEADER_GUARD, true)
}