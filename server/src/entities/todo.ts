import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Users } from "./users";

@Entity()
export class Todos {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: false, default: "Not Started" })
  status: string;

  @Column({ nullable: true })
  @ManyToOne(() => Users, (user) => user.id)
  assignedTo: number;

  @Column({ nullable: false })
  deadline: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @ManyToOne(() => Users, (user) => user.id)
  createdBy: number;

  @UpdateDateColumn()
  updatedAt: Date;
}