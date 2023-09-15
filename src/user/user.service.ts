import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Repository } from 'typeorm'
import { CreateUserDto } from '../auth/dto/create-user.dto'
import { LoginUserDto } from '../auth/dto/login-user.dto'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async getALlUsers() {
    return this.userRepository.find()
  }
  async registration(dto: CreateUserDto): Promise<User | null> {
    const existingUser = await this.userRepository.findOne({
      where: {
        username: dto.username,
      },
    })
    if (existingUser) return null

    const createdUser = this.userRepository.create(dto)
    return this.userRepository.save(createdUser)
  }

  async login(dto: LoginUserDto): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: {
        username: dto.username,
      },
    })
    if (!user) return null
    return user
  }
  async findOne(username: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        username: username,
      },
    })
  }
}
