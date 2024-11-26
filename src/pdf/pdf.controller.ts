import { Body, Controller, Post, Res } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { Response } from 'express';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Post()
  async generatePdf(@Res() res: Response,
  @Body() data:any
  ) {
    const {htmlContent}=data; 
   
    const pdfBuffer = await this.pdfService.generatePdf(htmlContent);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Length': pdfBuffer.length,
      'Content-Disposition': 'inline; filename=example.pdf',
    });

    res.send(pdfBuffer);
  }
}
