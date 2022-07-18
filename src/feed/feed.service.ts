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
    const feeds = await this.mongoService.getItemsBy({});
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

    const feeds = await this.mongoService.getItemsBy(search2);
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

  let url = "https://elpais.com";
  let data = await axios.get(url);
  let html = cheerio.load(data.data);
  let listItems = html("main");

  const divPortadaElPais = html(listItems.children("div")[0]);
  obtainFeedsPortada(divPortadaElPais);                               // FUNCION RECURSIVA PARA OBTENER LOS FEEDS DE LA PORTADA

  url = "https://www.elmundo.es/";
  data = await axios.get(url);
  html = cheerio.load(data.data);
  listItems = html("main");

  const divPortadaElMundo = html(listItems.children("div")[3]);
  obtainFeedsPortada(divPortadaElMundo);                              // FUNCION RECURSIVA PARA OBTENER LOS FEEDS DE LA PORTADA

  return feeds;

  function obtainFeedsPortada(list) {
    list.each((idx, el) => {
      let feed: FeedI;
      feed = { title: "", body: "", publisher: "", image: "", source: "", };

      if (el.name === 'article') {                                    // OBTENGO LA INFORMACION SOLO DE LOS ARTICULOS

        obtainFeedsPortadaFields(html(el).children());                // FUNCION RECURSIVA PARA OBTENER LOS FIELDS PARA CADA ARTICULO

        function obtainFeedsPortadaFields(listTitle) {
          listTitle.each((idx2, el2) => {
            switch (el2.name) { 
              case 'img':                                             // LA IMAGEN SE OBTIENE DE IMG
                feed.image = el2.attribs.src;
                // console.log(`image: ${feed.image}`);
                break;
              case 'header':                                          // EL TITULO SE OBTIENE DE HEADER
                feed.title = html(el2).text(); 
                // console.log(`title: ${feed.title}`); 

                obtainFeedsPortadaFieldsSource(html(el2).children()); // FUNCION RECURSIVA PARA OBTENER EL SOURCE PARA CADA ARTICULO
                break;
                
                function obtainFeedsPortadaFieldsSource(listTitle) {
                  listTitle.each((idx3, el3) => {
                    if (el3.name === "a") {                           // EL SOURCE SE OBTIENE DE a
                      if(el3.attribs.href.includes(url)){             // EL MUNDO VA CON URL
                        feed.source = el3.attribs.href; 
                      }else{
                        feed.source = url + el3.attribs.href;         // EL PAIS VA SIN URL                             
                      }
                      // console.log(`source: ${feed.source}`) 
                    } else {
                      return obtainFeedsPortadaFieldsSource(html(el3).children());
                    }
                  });
                } // FIN obtainFeedsPortadaFieldsSource
                
              case 'p':                                               // EL BODY SE OTIENE DE P (SOLO TIENE EL PAIS)
                feed.body = html(el2).text();
                // console.log(`body: ${feed.body}`);
                break;
              default:
                return obtainFeedsPortadaFields(html(el2).children());
            }
          });
        } // FIN obtainFeedsPortadaFields

        feed.publisher = url;                                         // EN PUBLISHER PONEMOS LA URL PARA SABER DE QUE PERIODICO ES
        // console.log(`publisher: ${feed.publisher} \n`);

        feeds.push(feed);
      } else {
        return obtainFeedsPortada(html(el).children());
      }
    });
  } // FIN obtainFeedsPortada
}

