import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common'
import { UserService } from '../user/user.service'
import { RegistrationGuard } from './guards/registration.guard'
import { CreateUserDto } from './dto/create-user.dto'
import { Response } from 'express'
import { LoginUserDto } from './dto/login-user.dto'
import { LoginGuard } from './guards/login.guard'
import { AuthService } from './auth.service'
import { RefreshJwtGuard } from './guards/refresh-jwt.guard'
import { RefreshTokenDto } from './dto/refresh-token.dto'

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @UseGuards(RegistrationGuard)
  @Post('registration')
  async registrationUser(@Body() dto: CreateUserDto, @Res() res: Response) {
    await this.userService.registration(dto)
    res.statusCode = HttpStatus.CREATED
    return res.send({ message: 'user created' })
  }

  @UseGuards(LoginGuard)
  @Post('login')
  async loginUser(@Body() dto: LoginUserDto, @Res() res: Response) {
    const user = await this.userService.login(dto)

    const access = await this.authService.generateAccessToken(user)
    const refresh = await this.authService.generateRefreshToken(String(user.id))

    res.statusCode = HttpStatus.OK
    return res.send({ ...access, ...refresh, username: user.username })
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refreshToken(@Body() dto: RefreshTokenDto, @Res() res: Response) {
    const validToken = this.authService.verifyToken(dto.refresh_token)
    const user = await this.userService.findOne(dto.username)
    const access = await this.authService.generateAccessToken(user)

    if (validToken?.error) {
      if (validToken?.error === 'jwt expired') {
        const refresh = await this.authService.generateRefreshToken(user.id)

        res.statusCode = HttpStatus.OK
        return res.send({ ...access, ...refresh })
      } else {
        res.statusCode = HttpStatus.BAD_REQUEST
        return res.send({ error: validToken?.error })
      }
    } else {
      res.statusCode = HttpStatus.OK
      return res.send({ ...access, refresh_token: dto.refresh_token })
    }
  }
}
