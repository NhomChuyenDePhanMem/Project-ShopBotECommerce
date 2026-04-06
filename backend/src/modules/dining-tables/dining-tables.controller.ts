import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateDiningTableDto } from './dto/create-dining-table.dto';
import { UpdateDiningTableStatusDto } from './dto/update-dining-table-status.dto';
import { DiningTablesService } from './dining-tables.service';

@Controller('dining-tables')
export class DiningTablesController {
  constructor(private readonly diningTablesService: DiningTablesService) {}

  @Get()
  findAll(@Query('status') status?: 'available' | 'occupied' | 'reserved') {
    return this.diningTablesService.findAll(status);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.diningTablesService.findById(id);
  }

  @Post()
  create(@Body() dto: CreateDiningTableDto) {
    return this.diningTablesService.create(dto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateDiningTableStatusDto,
  ) {
    return this.diningTablesService.updateStatus(id, dto);
  }
}
