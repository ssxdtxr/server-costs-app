import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

// nest g resource items
@Entity({ name: 'User' })
export class User {
  @PrimaryGeneratedColumn()
  id: string

  @Column()
  username: string

  @Column()
  password: string
}
