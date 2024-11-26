


import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";




export class SendEmailPersonalDto {

    @IsNotEmpty()
    @IsString()
    to:string;

    @IsString()
    @IsOptional()
    subject?:string;

    @IsString()
    @IsOptional()
    html?:string;

}
