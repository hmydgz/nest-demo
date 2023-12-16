import { News } from '@app/db/schemas/news.schema';
import { Inject, Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { CreateNewsDTO } from './dto/create.dto';

@Injectable()
export class NewsService {
  constructor(
    @Inject(News.name) private readonly newsModel: ReturnModelType<typeof News>
  ) {}

  async getAll() {
    return await this.newsModel.find()
  }

  async create(data: CreateNewsDTO) {
    return await this.newsModel.create(data)
  }
}
