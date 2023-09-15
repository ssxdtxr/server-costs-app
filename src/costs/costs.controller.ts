import {
  Body,
  Controller, Delete,
  Get,
  HttpCode,
  HttpStatus, Param, Patch, Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import { CostsService } from './costs.service'
import { AuthService } from '../auth/auth.service'
import { JwtGuard } from '../auth/guards/jwt.guard'
import { CreateCostDto } from './dto/create-cost.dto'
import { UpdateCostsDto } from './dto/update-costs.dto'

@Controller('costs')
export class CostsController {
  constructor(
    private readonly costsService: CostsService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(JwtGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllCosts(@Req() req, @Res() res) {
    const token = req.token
    const user = await this.authService.getUserByTokenData(token)
    const costs = await this.costsService.findAll()
    const filteredCosts = costs.filter((cost) => cost.id === user.id)
    return res.send({ filteredCosts })
  }

  @UseGuards(JwtGuard)
  @Post()
  @HttpCode(HttpStatus.OK)
  async createCosts(@Body() dto: CreateCostDto, @Req() req) {
    const user = await this.authService.getUserByTokenData(req.token)
    return await this.costsService.create({
      ...dto,
      userId: user.id,
    })
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateCosts(@Body() dto: UpdateCostsDto, @Param('id') id: string) {
    return await this.costsService.update(dto, id)
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteCosts(@Param('id') id: string) {
    return await this.costsService.delete(id)
  }
}
