import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { UserService } from '../../user/user.service'

@Injectable()
export class RefreshJwtGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const { refresh_token, username } = request.headers.body()

    if (!refresh_token) {
      throw new UnauthorizedException('Поле refresh_token обязательно')
    }

    if (!username) {
      throw new UnauthorizedException('Поле username обязательно')
    }

    const user = await this.userService.findOne(username)

    if (!user) {
      throw new UnauthorizedException('Пользователя не существует')
    }
    return true
  }
}
