
import {  IsOptional, IsPositive, Min, isString } from "class-validator";


export class SearchFindAllDto{
    
 
    @IsOptional()
    modelo?:string;



    @IsOptional()
    termino?:string;
    
    
}