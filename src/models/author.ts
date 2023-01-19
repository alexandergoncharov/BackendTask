import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
  } from "typeorm";
  
  @Entity()
  export class Author {
    @PrimaryGeneratedColumn()
    authorId!: number;
  
    @Column()
    name!: string;
  }