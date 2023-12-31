import { Controller, Delete, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { SearchService } from './search.service';

@ApiTags('Search')
@Controller('search')
@UseGuards(RolesGuard)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  /**
   * 搜尋文章
   * @param keyword
   */
  @Get('/article')
  async searchArticle(@Query('keyword') keyword) {
    const data = await this.searchService.searchArticle('article', keyword);
    return data;
  }

  /**
   * 獲取搜索記錄
   */
  @Get('/')
  @UseGuards(JwtAuthGuard)
  async findAll(@Query() queryParam) {
    return this.searchService.findAll(queryParam);
  }

  /**
   * 刪除文件
   * @param id
   */
  @Delete(':id')
  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  deleteById(@Param('id') id) {
    return this.searchService.deleteById(id);
  }
}
