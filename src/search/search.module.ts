import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';

@Module({
  controllers: [SearchController],
  providers: [SearchService],
  imports:[
  ]
})
export class SearchModule {}
