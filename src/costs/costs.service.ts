import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Costs } from './entities/cost.entity'
import { CreateCostDto } from './dto/create-cost.dto'
import { UpdateCostsDto } from './dto/update-costs.dto'

@Injectable()
export class CostsService {
  constructor(
    @InjectRepository(Costs)
    private readonly costsRepository: Repository<Costs>,
  ) {}

  async findAll(): Promise<Costs[]> {
    return this.costsRepository.find()
  }

  async create(dto: CreateCostDto): Promise<Costs> {
    const createdCost = this.costsRepository.create(dto)
    return this.costsRepository.save(createdCost)
  }

  async findOne(id: string): Promise<Costs> {
    return this.costsRepository.findOne({
      where: {
        id: id,
      },
    })
  }

  async update(dto: UpdateCostsDto, id: string): Promise<Costs> {
    await this.costsRepository.update(
      {
        id: id,
      },
      {
        ...dto,
      },
    )
    return this.findOne(id)
  }

  async delete(id: string): Promise<void> {
    await this.costsRepository.delete({
      id: id,
    })
  }
}
