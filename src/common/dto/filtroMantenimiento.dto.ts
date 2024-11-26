
import {  IsOptional, IsString,  } from "class-validator";


export class SearchMantenimientoDto{

   
    @IsString()
    @IsOptional()
    inicio?:string;
    

   
    @IsString()
    @IsOptional()
    fin?:string;
   
    @IsString()
    @IsOptional()
    division?:string;

   
    @IsString()
    @IsOptional()
    numero?:string;

    @IsString()
    @IsOptional()
    sede?:string;
    


}