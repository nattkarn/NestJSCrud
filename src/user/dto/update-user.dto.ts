import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    
    @IsOptional()
    @IsString()
    readonly name: string

    @IsOptional()
    @IsString()
    readonly tel: string
}


