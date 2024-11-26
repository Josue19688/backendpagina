
import {  IsOptional, IsPositive, Min, isString } from "class-validator";


export class SearchTerminoDto{
    
   
    @IsOptional()
    inicio?:string;
    
    @IsOptional()
    fin?:string;

    @IsOptional()
    modelo?:string;

    @IsOptional()
    termino?:string;
    
    
}