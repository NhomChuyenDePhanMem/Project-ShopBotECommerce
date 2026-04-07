import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiningTable } from '../../database/entities/dining-table.entity';
import { Reservation } from '../../database/entities/reservation.entity';
import { DiningTablesController } from './dining-tables.controller';
import { DiningTablesService } from './dining-tables.service';

@Module({
  imports: [TypeOrmModule.forFeature([DiningTable, Reservation])],
  controllers: [DiningTablesController],
  providers: [DiningTablesService],
  exports: [DiningTablesService],
})
export class DiningTablesModule {}
