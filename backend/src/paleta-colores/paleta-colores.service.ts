import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaletaColoresService {
  constructor(private prisma: PrismaService) {}

  async findByEmpresa(empresa: string) {
    const paleta = await this.prisma.paletaColore.findUnique({
      where: { empresaNit: empresa },
    });
    if (!paleta) throw new NotFoundException(`Paleta de colores para empresa ${empresa} no encontrada`);
    return {
      primary_color: paleta.primaryColor,
      color_primario_hover: paleta.colorPrimarioHover,
      color_fondo: paleta.colorFondo,
      color_acento: paleta.colorAcento,
      color_secundario: paleta.colorSecundario,
      color_texto: paleta.colorTexto,
      sidebar_bg: paleta.sidebarBg,
      sidebar_text: paleta.sidebarText,
      navbar_bg: paleta.navbarBg,
      navbar_text: paleta.navbarText,
      logo: paleta.logo,
    };
  }
}
