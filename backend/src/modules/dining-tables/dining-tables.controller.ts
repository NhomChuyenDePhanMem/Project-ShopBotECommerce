import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { DiningTablesService } from './dining-tables.service';
import { CreateDiningTableDto } from './dto/create-dining-table.dto';
import { UpdateDiningTableStatusDto } from './dto/update-dining-table-status.dto';

@Controller('dining-tables')
export class DiningTablesController {
  constructor(private readonly tablesService: DiningTablesService) {}

  @Get()
  findAll() {
    return this.tablesService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.tablesService.findById(id);
  }

  @Post()
  create(@Body() dto: CreateDiningTableDto) {
    return this.tablesService.create(dto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateDiningTableStatusDto,
  ) {
    return this.tablesService.updateStatus(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tablesService.remove(id);
  }
}
