import { IsDate, IsDateString, IsNotEmpty } from "class-validator";

export class CreateTodoDto {
  @IsNotEmpty({ message: "Title is required" })
  title: string;
  description: string;
  @IsDateString({strict: true}, { message: "Deadline must be a date" })
  deadline: Date;
  createdBy: number;
}