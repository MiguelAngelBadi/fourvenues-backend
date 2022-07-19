import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { FeedService } from './feed.service';
import { CreateFeedDto, UpdateFeedDto } from './dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('2 - Feed')
@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Post()
  create(@Body() createFeedDto: CreateFeedDto) {
    return this.feedService.create(createFeedDto);
  }

  @Get('/obtainFeeds')
  obtainFeed() {
    return this.feedService.obtainFeeds();
  }

  @Get()
  findAll() {
    return this.feedService.findAll();
  }

  @Get('byDate')
  @ApiQuery({
    name: 'fechaOut',
    example: "2022-07-19T00:00:00.000Z",
    description: 'The kind of the sms that wants to fetch',
    required: false
  })
  @ApiQuery({
    name: 'fechaIn',
    example: "2022-07-20T00:00:00.000Z",
    description: 'The kind of the sms that wants to fetch',
    required: false
  })
  findAllByDate(@Query('fechaIn') fechaIn, @Query('fechaOut') fechaOut) {
    return this.feedService.findAllByDate({fechaIn, fechaOut});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.feedService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFeedDto: UpdateFeedDto) {
    return this.feedService.update(id, updateFeedDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.feedService.remove(id);
  }
}
