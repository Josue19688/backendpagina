import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, BadRequestException, UploadedFiles, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { fileFilters } from './helpers/fileFilter';
import { fileNames } from './helpers/fileName';
import { diskStorage } from 'multer';
import { ConfigService } from '@nestjs/config';
import { Auth, GetUser } from 'src/auth/decorators';
import { Usuario } from 'src/auth/entities/auth.entity';
import { Response } from 'express';
import { CreateArticuloDto } from 'src/articulo/dto/create-articulo.dto';
import { ArticuloService } from 'src/articulo/articulo.service';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,

    
    private readonly articuloService:ArticuloService,
  ) {}


   
  /**
   * Metodo general para subir imagenes desde un editor
   * @param files 
   * @returns 
   */
  @Post('uploads/editor')
  @UseInterceptors(FilesInterceptor('files', undefined, {
    fileFilter: fileFilters,
    storage: diskStorage({
      destination: './static/uploads',
      filename: fileNames
    })
  }))
  subirFileUploadsPublic(
    @UploadedFiles() files: Array<Express.Multer.File>,
   
  ) {

    console.log(files)
    if (!files || files.length === 0) {
      throw new BadRequestException(
        'File is required. Only accepted images',
      );
    }

    const file = files[0];

    // Construye la URL del archivo subido

    const url = `${this.configService.get('HOST_API')}/files/uploads/${file.filename}`;

    return {
      success: 1,
      file: {
        url,
      },
    };

  }



  
  /**
   * Metodo general para subir imagenes o archivos por collecion o entidad
   * el cual se reutilizara segun necesidades este sera para lo publico donde no
   * haya autenticacion
   * @param files 
   * @param modelo 
   * @returns 
   */
  @Post('uploads/public')
  @UseInterceptors(FilesInterceptor('files', undefined, {
    fileFilter: fileFilters,
    storage: diskStorage({
      destination: './static/uploads',
      filename: fileNames
    })
  }))
  subirDataUploadsPublic(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() entityDto:any,
  ) {

    const modelos = ['ticket'];

    const {modelo, ...details } = entityDto;

    if (!modelos.includes(modelo)) throw new BadRequestException('Models NotFound...');

    if (!files.length) throw new BadRequestException('File is required, only accepted images');
    //let imagens: any[] = [];

    const imagens = files.map(files => `${this.configService.get('HOST_API')}/files/uploads/${files.filename}`);

    //const imagen=imagens[0];

    switch (modelo) {
     
      default:
        'No se encontro el modelo';
    }

    return 'insertado correctamente';

  }


    /**
 * Metodo general para subir imagenes o archivos por collecion o entidad
 * el cual se reutilizara segun necesidades este sera para lo publico donde no
 * haya autenticacion
 * @param files 
 * @param modelo 
 * @returns 
 */
    @Post('uploads/private')
    @Auth()
    @UseInterceptors(FilesInterceptor('files', undefined, {
      fileFilter: fileFilters,
      storage: diskStorage({
        destination: './static/uploads',
        filename: fileNames
      })
    }))
    subirDataUploadsPrivate(
      @UploadedFiles() files: Array<Express.Multer.File>,
      @Body() entityDto:any,
      @GetUser() usuario: Usuario
    ) {
  
      let response:any;
      const modelos = ['ticket', 'herramienta', 'post', 'articulo'];
  
      const {modelo, ...details } = entityDto;
  
      if (!modelos.includes(modelo)) throw new BadRequestException('Models NotFound...');
  
      if (!files.length) throw new BadRequestException('File is required, only accepted images');
      //let imagens: any[] = [];
  
      const imagens = files.map(files => `${this.configService.get('HOST_API')}/files/uploads/${files.filename}`);
  
      //const imagen=imagens[0];
  
      switch (modelo) {
        
       
        default:
          'No se encontro el modelo';
      }
  
      return 'insertado correctamente';
  
    }





  @Get('uploads/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ) {
    const path = this.filesService.getStaticProductImage(imageName);
    res.sendFile(path);
  }

  
  /**
   * Metodo general para subir imagenes o archivos por collecion o entidad
   * el cual se reutilizara segun necesidades
   * @param files 
   * @param modelo 
   * @param user 
   * @returns 
   */
  // @Post('uploads/model')
  // @Auth()
  // @UseInterceptors(FilesInterceptor('files', undefined, {
  //   fileFilter: fileFilters,
  //   storage: diskStorage({
  //     destination: './static/uploads',
  //     filename: fileNames
  //   })
  // }))
  // subirDataUploads(
  //   @UploadedFiles() files: Array<Express.Multer.File>,
  //   @Body() entityDto:any,
  //   @GetUser() usuario: Usuario
  // ) {

  //   const modelos = [ 'post','usuario', 'ticket', 'herramientas'];

  //   const {modelo, ...details } = entityDto;

  //   if (!modelos.includes(modelo)) throw new BadRequestException('Models NotFound...');

  //   if (!files.length) throw new BadRequestException('File is required, only accepted images');
  //   let imagens: any[] = [];

  //   imagens = files.map(files => `${this.configService.get('HOST_API')}/files/uploads/${files.filename}`);

  //   const imagen=imagens[0];
  
    

  //   switch (modelo) {
  //     case 'post':
  //       const arrayData:CreatePostDto = {...details, imagen};
  //       this.postService.createPost(arrayData, usuario);
  //       //this.vacanteService.createVacante(arrayData , user)
  //       break;
  //     // case 'candidato':
  //     //   this.vacanteService.actualizarDocsCandidato(id, {candidatos:arrayData} )
  //     //   break;
  //     default:
  //       'No se encontro el modelo';
  //   }

  //   return 'insertado correctamente';

  // }


      


  
}
