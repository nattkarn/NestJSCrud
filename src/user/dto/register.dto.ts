import { IsString, IsNumber, IsOptional } from 'class-validator';



export class RegisterDTO {

    @IsString()
    readonly email: string;

    @IsString()
    @IsOptional()
    readonly password: string;

    @IsString()
    readonly name: string;

    @IsString()
    @IsOptional()
    readonly tel: string;

    @IsString()
    @IsOptional()
    readonly googleId: string;

    @IsString()
    @IsOptional()
    readonly picProfile : string

  }