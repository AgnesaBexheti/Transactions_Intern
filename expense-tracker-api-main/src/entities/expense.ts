import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from './category';

@Entity('Expense')
export class Expense {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column('decimal')
  value!: number;

  @ManyToOne(() => Category, (category) => category.expenses)
  @JoinColumn({ name: 'categoryId' })
  category!: Category;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
