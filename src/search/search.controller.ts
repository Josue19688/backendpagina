import { GraficaModeloDto } from './../common/dto/graficaModelo.tdo';
import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchDto } from 'src/common/dto/search.dto';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  findAllModelos(@Query() searchDto:SearchDto) {
    return this.searchService.findAllModelsDate(searchDto);
  }


  @Get('graficaCount')
  graficaModelo() {
    return this.searchService.countModels();
  }

  @Get('graficas')
  graficaNovedad(@Query() graficaModeloDto:GraficaModeloDto) {
    
    return this.searchService.graficas(graficaModeloDto);
  }
}
