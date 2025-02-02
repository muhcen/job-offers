import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';
@Injectable()
export class LocationService {
  private readonly logger = new Logger(LocationService.name);

  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  async findOrCreateLocation(locationData: {
    city: string;
    state: string;
  }): Promise<Location> {
    try {
      let location = await this.locationRepository.findOne({
        where: { city: locationData.city, state: locationData.state },
      });

      if (!location) {
        location = this.locationRepository.create({
          city: locationData.city,
          state: locationData.state,
        });

        location = await this.locationRepository.save(location);
      }

      return location;
    } catch (error) {
      this.logger.error(
        'Error during location creation or retrieval:',
        error.stack,
      );
      throw new Error(`Failed to find or create location: ${error.message}`);
    }
  }
}
