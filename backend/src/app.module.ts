import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { DocumentosModule } from './documentos/documentos.module';
import { TareasModule } from './tareas/tareas.module';
import { RecordatoriosModule } from './recordatorios/recordatorios.module';
import { ColaboradoresModule } from './colaboradores/colaboradores.module';
import { ReunionesModule } from './reuniones/reuniones.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    DocumentosModule,
    TareasModule,
    RecordatoriosModule,
    ColaboradoresModule,
    ReunionesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
