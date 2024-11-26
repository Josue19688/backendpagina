import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/auth.entity';
import { DataSource, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ImagenUsuario } from './entities/user-image.entity';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { isUUID } from 'class-validator';
import { JwtPayload } from './interfaces';
import { LoginUserDto } from './dto/login-user.dto';
import { PaginationDto } from 'src/common/dto/pagination.tdo';
import { ValidateResetPassword } from './dto/validate-reset-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ActivateUserDto } from './dto/activated-user.tdo';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
 
  private readonly logger = new Logger('AuthService')

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Usuario)
    private readonly userRepository: Repository<Usuario>,
    @InjectRepository(ImagenUsuario)
    private readonly userImageRepository:Repository<ImagenUsuario>,


    private readonly jwtService:JwtService,
    private readonly dataSource: DataSource,
    private readonly emailService:EmailService,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const { password, correo, ...userData } = createUserDto;

    const userEmail = await this.userRepository.findOne({
      where: {
        correo
      }
    })

    if (userEmail) throw new NotFoundException(`El correo  ${correo} ya existe...`);

    try {

     
      const user = this.userRepository.create({
        ...userData,
        correo,
        password: bcrypt.hashSync(password, 10),
        token:uuidv4()
      });

      await this.userRepository.save(user);
      delete user.password;

      const urlValidacion =`${this.configService.get('HOST_FRONT')}?id=${user.id}&code=${user.token}`

    
      const data={
        to:correo,
        subject:'Activación de Cuenta de Usuairo',
        template:'activate-account',
        url:urlValidacion
      };
      await this.emailService.sendEmail(data);


      return {
        ...user,
        autorizacioón:this.getJwtToken({id:user.id})
      }

    } catch (error) {
      this.handleExceptions(error);

    }

  }

  async activateUser(activateUserDto: ActivateUserDto) {
    const { id, code } = activateUserDto;
    
    const user = await this.userRepository.findOne({
      where: {
        id: id,
        token: code,
        activo: false
      }
    })

    if (!user){
      throw new NotFoundException({msg:'Usuario no valido!!'});
    } 

    user.activo=true;
    user.token=null;
    await this.userRepository.save(user);
    return {msg:'Cuenta activada exitosamente!'};


  }

  async resetPasswordToken(resetPasswordDto:ResetPasswordDto){
    const {correo} =resetPasswordDto;

    const user =await this.userRepository.findOne({
      where:{
        correo
      }
    })

    const token = this.pgenerate(10);

    if (!user) throw new NotFoundException(`User notFound!!`);

    user.resetPasswordToken=uuidv4();
    user.password=bcrypt.hashSync(token, 10)
    this.userRepository.save(user);

      // const data =`<b>Correo solitante: </b>${correo},\n<b>Token </b> : ${token}, \n<b>Url </b>: ${`https://ciberseguridad-gt.vercel.app`}`;
      // botLogs(data);
    
   
  //   const data={
  //     to:correo,
  //     subject:'Cambio de Contraseña',
  //     template:'reset-password',
  //     url:`https://ciberseguridad-gt.vercel.app`,
  //     token:token
  //   };
  //  const respuesta = await this.emailService.sendEmail(data);

    return {token:token, msg:'Contraseña temporal'};
  }

  async validatePassword(validateResetPassword:ValidateResetPassword){
    const {correo, password} = validateResetPassword;

    const user = await this.userRepository.findOne({
      where: {
        correo,
        activo: true
      }
    })

    if (!user) throw new NotFoundException(`User notFound!!`);

    user.password=bcrypt.hashSync(password, 10)
    this.userRepository.save(user);
    return {msg:'Contraseña reestablecida exitosamente!!'};
  }


  async login(loginUserDto: LoginUserDto) {


    const { password, correo } = loginUserDto;
    

    const user = await this.userRepository.findOne({
      where: { correo},
      select: { correo: true, password: true,id:true,nombre:true,roles:true,activo:true }
    });

    if (!user) throw new UnauthorizedException('Credenciales invalidas!!');
    if (user.activo===false) throw new UnauthorizedException('Usuario inabilitado, comuniquese al departamento de seguirdad. EXT.418, para activarlo.');

    if (!bcrypt.compareSync(password, user.password)) throw new UnauthorizedException('Credenciales invalidas!!');

    const {password:_, ...rest}=user;
    
    return {
      user: rest,
      token:this.getJwtToken({id:user.id})
    }
  }

  async checkAuthStatus(user:Usuario){

    return {
      
      user:user,
      token:this.getJwtToken({id:user.id})
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit=100, offset = 0 } = paginationDto;
    const user = await this.userRepository.find({
      take: limit,
      skip: offset,
      relations: {
        imagenes: true
      }
    })

    const usuarios =user.map(usuario => ({
      ...usuario,
      imagenes: usuario.imagenes.map(img => img.url)
    }))

    return {ok:true, usuarios};
  }
  
  async findOne(termino: string) {

    let user: Usuario;

    if (isUUID(termino)) {
      user = await this.userRepository.findOneBy({ id: termino });
    } else {
      const queryBuilder = this.userRepository.createQueryBuilder('user');
      user = await queryBuilder
        .where('UPPER(email)=:email or UPPER(fullName)=:fullName', {
          title: termino.toUpperCase(),
          slug: termino.toLowerCase(),
        })
        .leftJoinAndSelect('user.images', 'userImages')
        .getOne();
    }

    if (!user) throw new NotFoundException(`El registro con ${termino} no existe.`);

    return user;
  }

  async update(id:string,updateUserDto:UpdateUserDto,user:Usuario){

    const {images, ...toUpdate} = updateUserDto;

    const userDb =  await this.userRepository.preload({
      id,
      ...toUpdate
    })

    if (!userDb) throw new NotFoundException(`El registro con ${id} no existe`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      if (images) {
        await queryRunner.manager.delete(ImagenUsuario, { user: { id } });
        userDb.imagenes = images.map(image => 
          this.userImageRepository.create({ url: image})
        )
      }

      await queryRunner.manager.save(userDb);
      await queryRunner.commitTransaction();
      await queryRunner.release();


      return this.findOnePlane(id);
      
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      this.handleExceptions(error);
    }

  }

  async findOnePlane(termino: string) {
    const { imagenes = [], ...rest } = await this.findOne(termino);
    return {
      ...rest,
      images: imagenes.map(image => image.url)
    }
  }


  async remove(id: string) {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
    return {ok:true,msg:'Usuario Eliminada'};
  }

  private getJwtToken(payload:JwtPayload){

    const token = this.jwtService.sign(payload);
    return token;

  }

  private handleExceptions(error: any): never {
    if (error.code === 11000) {
      throw new BadRequestException(`El registro ya existe!!`);
    }
    if (error.code === '23505') {
      throw new BadRequestException(`El registro ya existe!!`);
    }
    this.logger.error(error);
    throw new InternalServerErrorException(`Error al crear el registro en el servidor`);
  }

  private pgenerate(length:any) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$&@';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result+5;
 }

}
