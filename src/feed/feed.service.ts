import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoService } from 'src/database/mongo/mongo.service';
import { CreateFeedDto, UpdateFeedDto } from './dto';
import { Feed, FeedDocument } from './schema/feed.schema';

@Injectable()
export class FeedService {
  private readonly mongoService: MongoService;

  constructor(@InjectModel(Feed.name) private feedModel: Model<FeedDocument>) {
    this.mongoService = new MongoService(this.feedModel);
  }

  async create(createUserDto: CreateFeedDto) {
    const feed = await this.mongoService.createItem(createUserDto);
    return feed;
  }

  async findAll() {
    const feeds = await this.mongoService.getItemsBy({});
    return feeds;
  }

  async findOne(deviceId: string) {
    const feed = await this.mongoService.getItemBy({ deviceId });
    return feed;
  }

  async update(id: string, updateUserDto: UpdateFeedDto) {
    const feed = await this.mongoService.updateItemById(id, updateUserDto);
    return feed;
  }

  async remove(id: string) {
    const deletedFeed = await this.mongoService.removeItemById(id);
    return deletedFeed;
  }
}

