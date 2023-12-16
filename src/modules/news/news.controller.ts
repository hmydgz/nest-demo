import { CreateNewsDTO } from './dto/create.dto';
import { NewsService } from './news.service';
import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('news')
export class NewsController {
  constructor(
    private readonly newsService: NewsService
  ) {}

  @Get()
  async getAll() {
    return await this.newsService.getAll()
  }

  @Post()
  async create(@Body() body: CreateNewsDTO) {
    return await this.newsService.create(body)
  }
}
