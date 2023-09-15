import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { AuthService } from '../auth.service'

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const token = request.headers.authorization.split(' ')[1]

    if (!token) {
      throw new UnauthorizedException('Ошибка авторизации')
    }

    const validToken = this.authService.verifyToken(token)

    if (validToken?.error) {
      throw new UnauthorizedException(validToken.error)
    }
    return (request.token = token)
  }
}
