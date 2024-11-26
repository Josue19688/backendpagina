
import { IsOptional} from "class-validator";


export class GraficaModeloDto{

   
    @IsOptional()
    modelo?:string;
    
}