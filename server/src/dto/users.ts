import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty({ message: "Username must not be empty" })
  username: string;

  @IsNotEmpty({ message: "Name must not be empty" })
  name: string;

  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @IsNotEmpty({ message: "Password must not be empty" })
  password: string;

  @IsString({ message: "Role must be a string" })
  role: "team" | "lead" = "team";
}

export class LoginDto {
  @IsNotEmpty({ message: "Username must not be empty" })
  username: string;

  @IsNotEmpty({ message: "Password must not be empty" })
  password: string;
}