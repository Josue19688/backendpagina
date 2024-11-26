import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GraficaModeloDto } from 'src/common/dto/graficaModelo.tdo';
import { SearchDto } from 'src/common/dto/search.dto';
import { Between, Repository } from 'typeorm';

@Injectable()
export class SearchService {


    private readonly logger = new Logger('SearchService')
    constructor(

       

    ) { }



    async findAllModelsDate(searchDto: SearchDto) {
        const { inicio, fin, modelo } = searchDto;

        const modelos = ['usuario', 'ticket'];

        if (!modelos.includes(modelo)) throw new BadRequestException('Models NotFound...');

        let data: any[] = [];

        switch (modelo) {
            case 'ticket':
                
                break;

            default:
                return { ok: false, msg: 'Collecion no encontrada' };

        }
        return { resultado: data };
    }

    async countModels() {
        let data: any[] = [];

       
        return data;

    }


    async graficas(graficaModeloDto: GraficaModeloDto) {
        const { modelo } = graficaModeloDto;
        const modelos = [
            'tipo',
            'prioridad'
        ];

        if (!modelos.includes(modelo)) throw new BadRequestException('Models NotFound...');

        let data: any[] = [];

        switch (modelo) {
           
            default:
                return { ok: false, msg: 'Collecion no encontrada' };

        }


        return { resultado: data };

    }



    //   async graficas(graficaModeloDto: GraficaModeloDto) {
    //     const { modelo } = graficaModeloDto;
    //     const modelos = [
    //       'usuario', 
    //       'inventario', 
    //       'mantenimiento', 
    //       'mantenimientos', 
    //       'mantenimientosip',
    //       'mantenimientosdiv',
    //       'mantenimientosdep',
    //       'mantenimientossede',
    //       'mantenimientosinventario',
    //     ];

    //     if (!modelos.includes(modelo)) throw new BadRequestException('Models NotFound...');

    //     let data: any[] = [];

    //     switch (modelo) {
    //       case 'usuario':
    //         data = await this.userRepository
    //           .createQueryBuilder('user')
    //           .select("user.isActive")
    //           .addSelect("COUNT(*)")
    //           .groupBy("user.isActive")
    //           .execute();
    //         break;
    //       case 'mantenimiento':
    //         data = await this.mantenimientoRepository
    //           .createQueryBuilder('mantenimiento')
    //           .select("mantenimiento.tipoServicio")
    //           .addSelect("COUNT(*)")
    //           .groupBy("mantenimiento.tipoServicio")
    //           .execute();
    //         break;
    //       case 'mantenimientos':
    //         data = await this.mantenimientoRepository
    //           .createQueryBuilder('mantenimiento')
    //           .select("mantenimiento.tecnico")
    //           .addSelect("COUNT(*)")
    //           .groupBy("mantenimiento.tecnico")
    //           .execute();
    //         break;
    //       case 'mantenimientosip':
    //         data = await this.mantenimientoRepository
    //           .createQueryBuilder('mantenimiento')
    //           .select("mantenimiento.ip")
    //           .addSelect("COUNT(*)")
    //           .groupBy("mantenimiento.ip")
    //           .execute();
    //         break

    //       case 'mantenimientosdiv':
    //         data = await this.mantenimientoRepository
    //           .createQueryBuilder('mantenimiento')
    //           .leftJoinAndSelect("mantenimiento.division","div")
    //           .select("div.nombre")
    //           .addSelect("COUNT(*)")
    //           .groupBy("div.nombre")
    //           .execute();
    //         break
    //         case 'mantenimientosdep':
    //         data = await this.mantenimientoRepository
    //           .createQueryBuilder('mantenimiento')
    //           .leftJoinAndSelect("mantenimiento.departamento","dep")
    //           .select("dep.nombre")
    //           .addSelect("COUNT(*)")
    //           .groupBy("dep.nombre")
    //           .execute();
    //         break
    //         case 'mantenimientossede':
    //           data = await this.mantenimientoRepository
    //             .createQueryBuilder('mantenimiento')
    //             .leftJoinAndSelect("mantenimiento.sede","sede")
    //             .select("sede.nombre")
    //             .addSelect("COUNT(*)")
    //             .groupBy("sede.nombre")
    //             .execute();
    //           break
    //           case 'mantenimientosinventario':
    //           data = await this.mantenimientoRepository
    //             .createQueryBuilder('mantenimiento')
    //             .leftJoinAndSelect("inventario.numeroInventario","inventario")
    //             .select("inventario.numeroInventario")
    //             .addSelect("COUNT(*)")
    //             .groupBy("inventario.numeroInventario")
    //             .execute();
    //           break
    //       default:
    //         return { ok: false, msg: 'Collecion no encontrada' };

    //     }


    //     return { resultado: data };

    //   }


}
