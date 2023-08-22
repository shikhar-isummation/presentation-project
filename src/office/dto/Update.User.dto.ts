import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateOfficeDto {

    @IsNotEmpty()
    officeCode: number | any

    @IsString()
    addressLine1: string


    @IsString()
    addressLine2: string


    @IsString()
    city: string


    @IsString()
    country: string


    @IsString()
    phone: string

    @IsString()
    postalCode: string

    @IsString()
    state: string

    @IsString()
    territory: string

}

