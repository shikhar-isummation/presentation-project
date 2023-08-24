import { IsInt, IsNotEmpty, IsNumber, IsPositive, IsString, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateOfficeDto {

    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    @Type(() => Number)
    officeCode: number | any

    @IsString()
    addressLine1: string


    @IsString()
    addressLine2: string


    @IsString()
    city: string


    @IsString()
    country: string


    @IsNotEmpty()
    @Matches(/^\+\d{1,3} \d{3} \d{3} \d{4}$/, { message: 'Invalid phone number format', })
    phone: string

    @IsNumber()
    @Type(() => Number)
    postalCode: string

    @IsString()
    state: string

    @IsString()
    territory: string

}

