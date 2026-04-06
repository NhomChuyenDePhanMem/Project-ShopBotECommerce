import { IsIn } from 'class-validator';

export class UpdateReservationStatusDto {
  @IsIn(['booked', 'checked_in', 'cancelled', 'completed'])
  status: 'booked' | 'checked_in' | 'cancelled' | 'completed';
}
