import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Salary } from 'src/salary/entities/salary.entity';

@Entity('currencies')
export class Currency {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @OneToMany(() => Salary, (salary) => salary.currency)
  salaries: Salary[];
}
