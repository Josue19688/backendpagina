import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EmailService } from './email.service';
import { SendEmailPersonalDto } from './dto/sendMailPersonal';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('plaint-email')
  emailPlane(
    @Body() sendEmailPersonalDto:SendEmailPersonalDto
  ){
    return this.emailService.sendEmailTicket(sendEmailPersonalDto);
  }


  @Post('plaint-emailTemplate')
  emailPlaneTemplate(
    @Body() sendEmailPersonalDto:SendEmailPersonalDto
  ){
    return this.emailService.sendEmailTemplate(sendEmailPersonalDto);
  }
}
