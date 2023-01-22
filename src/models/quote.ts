import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { Author } from "./author";

@Entity()
export class Quote {
  @PrimaryGeneratedColumn()
  quoteId!: number;

  @Column()
  quote!: string;

  @ManyToOne(() => Author)
  @JoinColumn()
  author: Author;
}
