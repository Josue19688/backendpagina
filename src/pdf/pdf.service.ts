import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class PdfService {


    async generatePdf(htmlContent: string): Promise<Buffer> {

        const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
        const page = await browser.newPage();
    
        // Establece el contenido HTML en la página
        await page.goto('about:blank');
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
        // Espera a que todos los recursos estén cargados (ajusta el tiempo según sea necesario)
        await new Promise(resolve => setTimeout(resolve, 3000));
    
        // Genera el PDF con estilos aplicados
        const pdfBuffer:Uint8Array = await page.pdf({
          format: 'A4',
          printBackground: true,
        });
    
        // Cierra el navegador
        await browser.close();
    
        return Buffer.from(pdfBuffer);
    
      }
}
