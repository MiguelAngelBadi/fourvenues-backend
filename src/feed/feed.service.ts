import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoService } from 'src/database/mongo/mongo.service';
import { CreateFeedDto, UpdateFeedDto } from './dto';
import { FeedI } from './interfaces/feed.interface';
import { Feed, FeedDocument } from './schema/feed.schema';
const axios = require("axios");
const cheerio = require("cheerio");

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

  async obtainFeeds() {
    const feeds = await obtainFeeds();

    for (let feed of feeds) {
      const feedCreated = await this.create(feed);
    }
    return feeds;
  }

  async findAll() {
    let search = {};
    let options = {};

    const feeds = await this.mongoService.getItemsBy(search, options);
    return feeds;
  }

  async findAllToday() {
    let today = new Date();
    let fechaIn = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    let fechaOut = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    let searchElPais = {
      $and:
        [
          { createdAt: { $gte: fechaIn } },
          { createdAt: { $lte: fechaOut } },
          { url: process.env.URLELPAIS }
        ]
    };
    let searchElMundo = {
      $and:
        [
          { createdAt: { $gte: fechaIn } },
          { createdAt: { $lte: fechaOut } },
          { publisher: process.env.URLELMUNDO }
        ]
    };
    let options = {
      limit: 5
    }
    const feedsElPais = await this.mongoService.getItemsBy(searchElPais, options);
    const feedsElMundo = await this.mongoService.getItemsBy(searchElMundo, options);
    const feeds = feedsElPais.concat(feedsElMundo);
    return feeds;
  }

  async findAllByDate(search) {
    let search2 = {
      $and:
        [
          { createdAt: { $gte: search.fechaIn } },
          { createdAt: { $lte: search.fechaOut } }
        ]
    };

    let options = {};
    const feeds = await this.mongoService.getItemsBy(search2, options);
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

let obtainFeeds = async (): Promise<Array<FeedI>> => {
  const feeds = [];

  let url = process.env.URLELPAIS;
  let data = await axios.get(url);
  let html = cheerio.load(data.data);
  let listItems = html("main");

  const divPortadaElPais = html(listItems.children("div")[0]);
  obtainCoverFeeds(divPortadaElPais);                               // FUNCION RECURSIVA PARA OBTENER LOS FEEDS DE LA PORTADA

  url = process.env.URLELMUNDO;
  data = await axios.get(url);
  html = cheerio.load(data.data);
  listItems = html("main");

  const divPortadaElMundo = html(listItems.children("div")[3]);
  obtainCoverFeeds(divPortadaElMundo);                              // FUNCION RECURSIVA PARA OBTENER LOS FEEDS DE LA PORTADA

  return feeds;

  function obtainCoverFeeds(list) {
    list.each((idx, el) => {
      let feed: FeedI;
      feed = { title: "", body: "", publisher: "", image: "", source: "", };

      if (el.name === 'article') {                                    // OBTENGO LA INFORMACION SOLO DE LOS ARTICULOS

        obtainCoverFeedsFields(html(el).children());                // FUNCION RECURSIVA PARA OBTENER LOS FIELDS PARA CADA ARTICULO

        function obtainCoverFeedsFields(listTitle) {
          listTitle.each((idx2, el2) => {
            switch (el2.name) {
              case 'img':                                             // LA IMAGEN SE OBTIENE DE IMG
                feed.image = el2.attribs.src;
                break;
              case 'header':                                          // EL TITULO SE OBTIENE DE HEADER
                feed.title = html(el2).text();

                obtainCoverFeedsFieldsSource(html(el2).children()); // FUNCION RECURSIVA PARA OBTENER EL SOURCE PARA CADA ARTICULO
                break;

                function obtainCoverFeedsFieldsSource(listTitle) {
                  listTitle.each((idx3, el3) => {
                    if (el3.name === "a") {                           // EL SOURCE SE OBTIENE DE a
                      if (el3.attribs.href.includes(url)) {             // EL MUNDO VA CON URL
                        feed.source = el3.attribs.href;
                      } else {
                        feed.source = url + el3.attribs.href;         // EL PAIS VA SIN URL                             
                      }
                    } else {
                      return obtainCoverFeedsFieldsSource(html(el3).children());
                    }
                  });
                } // FIN obtainFeedsPortadaFieldsSource

              case 'p':                                               // EL BODY SE OTIENE DE P (SOLO TIENE EL PAIS)
                feed.body = html(el2).text();
                break;
              default:
                return obtainCoverFeedsFields(html(el2).children());
            }
          });
        } // FIN obtainFeedsPortadaFields

        feed.publisher = url;                                         // EN PUBLISHER PONEMOS LA URL PARA SABER DE QUE PERIODICO ES

        feeds.push(feed);
      } else {
        return obtainCoverFeeds(html(el).children());
      }
    });
  } // FIN obtainFeedsPortada
}

