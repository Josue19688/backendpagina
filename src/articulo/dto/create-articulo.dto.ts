import { IsNumber, IsArray, IsString, IsOptional } from "class-validator";

export class CreateArticuloDto {
    @IsOptional()
    @IsNumber()
    time?: number;
  
    @IsOptional()
    @IsArray()
    blocks?: object[];
  
    @IsOptional()
    @IsString()
    version?: string;
}


