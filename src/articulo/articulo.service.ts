import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateArticuloDto } from './dto/create-articulo.dto';
import { UpdateArticuloDto } from './dto/update-articulo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Articulo } from './entities/articulo.entity';
import { PaginationDto } from 'src/common/dto/pagination.tdo';
import { isUUID } from 'class-validator';



@Injectable()
export class ArticuloService {
  private readonly logger = new Logger('ArticuloService');

  constructor(
    @InjectRepository(Articulo)
    private readonly articuloRepository:Repository<Articulo>,
    private readonly dataSource:DataSource
  ){}
  
  async create(createArticuloDto: CreateArticuloDto) {
    try {
      const articulo = this.articuloRepository.create(createArticuloDto);
      const articulos = await this.articuloRepository.save(articulo);
      return {ok:true, articulos }
    } catch (error) {
      this.handleExceptions(error);
      return { ok: false, error: 'Error al crear el registro' };
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 8, offset = 0 } = paginationDto;
  
    try {
      const articulos = await this.articuloRepository
        .createQueryBuilder('articulo')
        .select([
          'articulo.id',
          'articulo.createdAt',
        ])
        .addSelect(
          `(SELECT row_to_json(block) FROM (
              SELECT 
                block->>'id' AS id, 
                block->>'type' AS type, 
                block->'data'->>'text' AS text, 
                block->'data'->>'level' AS level
              FROM jsonb_array_elements(articulo.blocks) AS block
              WHERE block->>'type' = 'header'
              LIMIT 1
            ) AS block)`,
          'headerBlock',
        )
        .orderBy('articulo.createdAt', 'DESC')
        .take(limit)
        .skip(offset)
        .getRawMany();
  
      // Transformación del resultado
      const filteredArticulos = articulos.map((articulo) => ({
        id: articulo.articulo_id,
        time: new Date(articulo.articulo_createdAt).getTime().toString(),
        createdAt: articulo.articulo_createdAt, 
        blocks: articulo.headerBlock
          ? [
              {
                id: articulo.headerBlock.id,
                type: articulo.headerBlock.type,
                data: {
                  text: articulo.headerBlock.text,
                  level: articulo.headerBlock.level
                    ? parseInt(articulo.headerBlock.level, 10)
                    : undefined,
                },
              },
            ]
          : [],
      }));
  
      return { ok: true, articulos: filteredArticulos };
    } catch (error) {
      this.handleExceptions(error);
    }
  }
  
  async findAllPagination(paginationDto: PaginationDto) {
    const { limit = 8, offset = 0 } = paginationDto;
  
    try {
      // Obtiene las entidades y datos en bruto
      const { entities: articulos, raw } = await this.articuloRepository
        .createQueryBuilder('articulo')
        .select([
          'articulo.id',
          'articulo.createdAt',
        ])
        .addSelect(
          `(SELECT row_to_json(block) FROM (
              SELECT 
                block->>'id' AS id, 
                block->>'type' AS type, 
                block->'data'->>'text' AS text, 
                block->'data'->>'level' AS level
              FROM jsonb_array_elements(articulo.blocks) AS block
              WHERE block->>'type' = 'header'
              LIMIT 1
            ) AS block)`,
          'headerBlock',
        )
        .orderBy('articulo.createdAt', 'DESC')
        .take(limit)
        .skip(offset)
        .getRawAndEntities();
  
      // Calcula el total de artículos usando count()
      const total = await this.articuloRepository.count();
  
      const filteredArticulos = articulos.map((articulo) => ({
        id: articulo.id,
        time: new Date(articulo.createdAt).getTime().toString(),
        createdAt: articulo.createdAt,
        blocks: raw.find((r) => r.articulo_id === articulo.id)?.headerBlock
          ? [
              {
                id: raw.find((r) => r.articulo_id === articulo.id).headerBlock.id,
                type: raw.find((r) => r.articulo_id === articulo.id).headerBlock.type,
                data: {
                  text: raw.find((r) => r.articulo_id === articulo.id).headerBlock.text,
                  level: parseInt(
                    raw.find((r) => r.articulo_id === articulo.id).headerBlock.level,
                    10,
                  ),
                },
              },
            ]
          : [],
      }));
  
      return {
        ok: true,
        total, // Total de artículos en la base de datos
        pages: Math.ceil(total / limit), // Total de páginas
        articulos: filteredArticulos,
      };
    } catch (error) {
      this.handleExceptions(error);
    }
  }
  
  

  async findOne(criterio: string): Promise<Articulo> {
    let articulo: Articulo;

    if (isUUID(criterio)) {
      articulo = await this.articuloRepository.findOneBy({ id: criterio });
    } else {
      
      const queryBuilder = this.articuloRepository.createQueryBuilder('a');

      
      articulo = await queryBuilder
        .leftJoin('a.blocks', 'b') 
        .where('UPPER(b.data->> "text") LIKE :criterio', { criterio: `%${criterio.toUpperCase()}%` })
        .getOne();
    }

    if (!articulo) {
      throw new NotFoundException(`El registro con el criterio ${criterio} no existe.`);
    }

    return articulo;
  }



  async remove(id: string) {
    const articulo = await this.findOne(id);
    await this.articuloRepository.remove(articulo);
    return {ok:true, msg:'Registro eliminado'}; 
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(`El registro ya existe!!`);
    }
    if (error.code === '23505') {
      throw new BadRequestException(`El registro ya existe!!`);
    }
    this.logger.error(error);
    throw new InternalServerErrorException(`Error al crear el registro en el servidor`);
  }
}
