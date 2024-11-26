import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { ArticuloService } from './articulo.service';
import { CreateArticuloDto } from './dto/create-articulo.dto';
import { UpdateArticuloDto } from './dto/update-articulo.dto';
import { PaginationDto } from 'src/common/dto/pagination.tdo';

@Controller('articulo')
export class ArticuloController {
  constructor(private readonly articuloService: ArticuloService) {}

  @Post()
  create(@Body() createArticuloDto: CreateArticuloDto) {
    return this.articuloService.create(createArticuloDto);
  }

  @Get()
  findAll(@Query() paginatioDto:PaginationDto) {
    return this.articuloService.findAll(paginatioDto);
  }

  @Get('/pagination')
  findAllPagination(@Query() paginatioDto:PaginationDto) {
    return this.articuloService.findAllPagination(paginatioDto);
  }

  @Get(':termino')
  findOne(@Param('termino') termino: string) {
    return this.articuloService.findOne(termino);
  }

 

  @Delete(':id')
  remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.articuloService.remove(id);
  }
}
