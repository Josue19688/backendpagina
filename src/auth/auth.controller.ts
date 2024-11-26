import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, Redirect } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth, GetUser } from './decorators';
import { UpdateUserDto } from './dto/update-user.dto';
import { Usuario } from './entities/auth.entity';
import { PaginationDto } from 'src/common/dto/pagination.tdo';
import { ValidateResetPassword } from './dto/validate-reset-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ActivateUserDto } from './dto/activated-user.tdo';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto:CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto:LoginUserDto){
    
    return this.authService.login(loginUserDto);
  }

  @Get('activate-account')
  activateAccount(@Query() activateUserDto: ActivateUserDto) {
   
    return this.authService.activateUser(activateUserDto);
  }

  @Patch('reset-password')
  resetPassword(
    @Body() resetPasswordDto:ResetPasswordDto
  ){
    return this.authService.resetPasswordToken(resetPasswordDto);
  }

  @Patch('validate-reset-password')
  validatePassword(
    @Body() validateResetPassword:ValidateResetPassword
  ){
    return this.authService.validatePassword(validateResetPassword);
  }

  @Get()
 
  findAll(@Query() paginatioDto:PaginationDto) {
    return this.authService.findAll(paginatioDto);
  }
  
  @Get('status')
  @Auth()
  checkAuthStatus(
    @GetUser() user:Usuario
  ){
    return this.authService.checkAuthStatus(user);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
     @Body() updateUserDto: UpdateUserDto,
     @GetUser() user:Usuario
  ){
    return this.authService.update(id, updateUserDto,user);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.authService.remove(id);
  }

}
