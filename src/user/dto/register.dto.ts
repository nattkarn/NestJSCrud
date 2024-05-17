import { IsString, IsNumber, IsOptional } from 'class-validator';



export class RegisterDTO {

    @IsString()
    readonly email: string;

    @IsString()
    readonly password: string;

    @IsString()
    readonly name: string;

    @IsString()
    @IsOptional()
    readonly tel: string;

  }