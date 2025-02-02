import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { Location } from './entities/location.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Location])],
  controllers: [],
  providers: [LocationService],
  exports: [LocationService],
})
export class LocationModule {}
