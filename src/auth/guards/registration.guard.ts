import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { AuthService } from '../auth.service'

@Injectable()
export class RegistrationGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const { username, password } = request.body
    const user = await this.authService.validateUser(username)

    if (!username || !password)
      throw new UnauthorizedException('Некорректно введены данные')

    if (user)
      throw new UnauthorizedException(`Пользователь ${username} уже существует`)
    return true
  }
}
