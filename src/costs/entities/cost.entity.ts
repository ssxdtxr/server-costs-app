import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

// nest g resource items
@Entity({ name: 'Costs' })
export class Costs {
  @PrimaryGeneratedColumn()
  id: string

  @Column()
  text: string

  @Column()
  price: number

  @Column({ default: new Date() })
  date: Date
}
