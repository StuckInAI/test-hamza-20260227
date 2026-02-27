import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class CalculationHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  calculation: string;

  @Column()
  result: string;

  @Column({ default: 'Food & Drink' })
  category: string;

  @CreateDateColumn()
  createdAt: Date;
}