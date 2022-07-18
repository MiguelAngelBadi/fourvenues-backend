import { Injectable, NotFoundException, Optional } from '@nestjs/common';

@Injectable()
export class MongoService {
  constructor(@Optional() private model) {}

  async createItem(itemDto) {
    const createdItem = await this.model.create(itemDto);
    return createdItem;
  }

  async getItemsBy(search) {
    const items = await this.model.find(search).exec();
    return items;
  }

  async getItemBy(search) {
    const item = await this.model.findOne(search).exec();

    if (!item) {
      throw new NotFoundException(`The item with '${search}' was not found.`);
    }

    return item;
  }

  async updateItemById(id: string, updateItemDto) {
    const updatedItem = await this.model
      .findByIdAndUpdate(id, updateItemDto, {
        // new: true
        returnDocument: 'after'
      })
      .exec();
    return updatedItem;
  }

  async removeItemById(id: string) {
    const deletedItem = await this.model.findByIdAndRemove({ _id: id }).exec();
    return {
      statusCode: 200,
      message: `The item with id '${deletedItem._id}' has been deleted succesfully`
    };
  }
}
