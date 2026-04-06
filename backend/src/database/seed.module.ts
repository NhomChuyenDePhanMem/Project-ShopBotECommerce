import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { DiningTable } from './entities/dining-table.entity';
import { MenuItem } from './entities/menu-item.entity';
import { Role } from './entities/role.entity';
import { Reservation } from './entities/reservation.entity';
import { User } from './entities/user.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Role,
      User,
      Category,
      MenuItem,
      DiningTable,
      Reservation,
    ]),
  ],
  providers: [SeedService],
})
export class SeedModule {}
