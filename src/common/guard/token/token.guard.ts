import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from 'src/modules/auth/auth.service';
import { getGuardReqRes } from '../utils';


@Injectable()
export class TokenGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  async canActivate(context: ExecutionContext) {
    const { req, res } = getGuardReqRes(context)
    const user = await this.authService.checkToken(req.headers.authorization)
    if (!user) {
      res.status(403).send({ code: 403, message: '无权访问' })
      return false
    } else {
      ;(req as any).user = user
      return true
    }
  }
}
