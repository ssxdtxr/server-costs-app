import { Module } from '@nestjs/common'
import { CostsController } from './costs.controller'
import { CostsService } from './costs.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Costs } from './entities/cost.entity'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [TypeOrmModule.forFeature([Costs]), AuthModule],
  controllers: [CostsController],
  providers: [CostsService],
  exports: [CostsService],
})
export class CostsModule {}
