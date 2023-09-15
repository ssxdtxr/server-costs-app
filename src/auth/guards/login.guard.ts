import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { AuthService } from '../auth.service'

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const { username, password } = request.body
    const user = await this.authService.validateUser(username)

    if (!user)
      throw new UnauthorizedException(`Пользователя ${username} не существует`)

    if (user.password !== password) {
      console.log(user.password, password)
      throw new UnauthorizedException(`Неправильный пароль`)
    }
    return true
  }
}
