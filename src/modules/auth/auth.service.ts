import { JwtService } from '@nestjs/jwt';
import { UserService } from './../user/user.service';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoginDTO } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { RegisterDTO } from './dto/register.dto';
import { ProvideEnum } from '@/common/enums/provide.enum';
import { PermissionCodeEnum } from '@/common/enums/permission.enum';
import { RedisKeys } from '@app/redis/keys';
import { JWT_SECRET_ENV_KEY } from 'src/config/keys';
import { useRedisCache } from 'src/common/utils';
import { RedisClient } from 'src/typings';
import { RoleService } from '../role/role.service';

@Injectable()
export class AuthService {

  private _jwtSecret: string
  private get jwtSecret() { // 缓存
    if (this._jwtSecret) return this._jwtSecret
    this._jwtSecret = this.config.get(JWT_SECRET_ENV_KEY)
    return this._jwtSecret
  }

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly roleService: RoleService,
    @Inject(ProvideEnum.REDIS_CLIENT) private readonly redisClient: RedisClient
  ) {}
  async checkToken(token?: string) {
    if (!token) return null
    try {
      const payload = await this.jwtService.verifyAsync(token, { secret: this.jwtSecret })
      return await useRedisCache(
        this.redisClient,
        RedisKeys.user(payload.id),
        () => this.userService.findById(payload.id)
      )
    } catch (error) {
      console.log(error)
      return false
    }
  }

  async checkPermissionCode(roleId: string, code: PermissionCodeEnum) {
    const key = RedisKeys.rolePermissionSet(roleId)
    if (!(await this.redisClient.exists(key))) {
      await this.redisClient.sAdd(
        key,
        (await this.roleService.find(roleId)).permissionCodeList
      )
    }
    return await this.redisClient.sIsMember(key, code)
  }

  async login(body: LoginDTO) {
    if (!body.username) throw new HttpException('请输入合法的用户名', HttpStatus.BAD_REQUEST)
    if (!body.password || body.password.length > 16 || body.password.length < 6) throw new HttpException('请输入合法的密码', HttpStatus.BAD_REQUEST)
    const user = await this.userService.findOneAndPwd({ username: body.username })
    if (!user) throw new HttpException('用户名不存在', HttpStatus.BAD_REQUEST)
    const isMatch = await bcrypt.compare(body.password, user.password)
    if (!isMatch) throw new HttpException('密码错误', HttpStatus.BAD_REQUEST)
    const token = await this.jwtService.signAsync({ id: user.id }, { secret: this.config.get(JWT_SECRET_ENV_KEY) })
    const _user = user.toJSON()
    delete _user.password
    return { token, user: _user }
  }

  async register({ username, password }: RegisterDTO) {
    if (!username) throw new HttpException('请输入合法的用户名', HttpStatus.BAD_REQUEST)
    if (!password || password.length > 16 || password.length < 6) throw new HttpException('请输入合法的密码', HttpStatus.BAD_REQUEST)
    const user = await this.userService.findOneAndPwd({ username })
    if (user) throw new HttpException('用户名已存在', HttpStatus.BAD_REQUEST)

    const hash = await bcrypt.hash(password, 10)
    const data = {
      username,
      password: hash
    }
    const res = await this.userService.create(data)
    return res
  }
}
