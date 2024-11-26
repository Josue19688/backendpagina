
import { IsNumber, IsOptional, IsPositive, Min, isString } from "class-validator";


export class SearchDto{

    @IsOptional()
    inicio?:string;
    

    
    @IsOptional()
    fin?:string;
    
    
    @IsOptional()
    modelo?:string;

}