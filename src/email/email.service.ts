import { Injectable } from '@nestjs/common';
import { SendEmailPersonalDto } from './dto/sendMailPersonal';
import { SendEmailDto } from './dto/sendEmail.dto';
import { MailerService } from '@nestjs-modules/mailer';



@Injectable()
export class EmailService {
  constructor(private mailService:MailerService){}



  async sendEmail(sendEmailDto:SendEmailDto){
   
    const {to, subject, template, url, token} = sendEmailDto;
    const response =await this.mailService.sendMail({
      to:to,
      from:'advinjosuev899@gmail.com',
      subject:subject,
      template: template,
      context: { 
        code: 'cf1a3f828287',
        username: 'john doe',
        url:url,
        token:token
      },
    })
    return 'Correo enviado exitosamente!!';
  }

  async sendEmailBoletin(sendEmailDto:any){
   
    const {to, subject, template, data} = sendEmailDto;
    const response =await this.mailService.sendMail({
      to:to,
      from:'advinjosuev899@gmail.com',
      subject:subject,
      template: template,
      context: { 
       tickets:data
      }
    })
    return 'Correo enviado exitosamente!!';
  }

  async sendEmailTemplate(sendEmailPersonalDto:SendEmailPersonalDto){
   
    const {to, subject, html} = sendEmailPersonalDto;
    await this.mailService.sendMail({
      to:to,
      from:'advinjosuev899@gmail.com',
      subject:subject,
      template: 'respuestaIncidenteTemplate',
      context: { 
        texto:html,
        correo:to
      },
    })
    return {msg:'Correo enviado exitosamente!!'};
  }


  async sendEmailTicket(sendEmailPersonalDto:SendEmailPersonalDto) {

    const { to, subject, html} =sendEmailPersonalDto;
    await this.mailService.sendMail({
      to,
      subject,
      html:html, 
    });
  }

}
