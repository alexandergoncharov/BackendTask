import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { User } from "./user";

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  token!: string;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;
}
