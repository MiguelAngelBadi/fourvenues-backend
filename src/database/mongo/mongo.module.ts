import { Module } from '@nestjs/common';
import { MongoService } from './mongo.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  providers: [MongoService]
  // exports: [MongoService]
})
export class MongoModule {}
