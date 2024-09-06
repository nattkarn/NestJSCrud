
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateUserDto {

    @IsString()
    readonly email: string

    @IsString()
    readonly password: string

    @IsString()
    readonly name: string

    @IsOptional()
    @IsString()
    readonly tel?: string
}
