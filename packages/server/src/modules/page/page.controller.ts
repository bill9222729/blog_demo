import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { Page } from './page.entity';
import { PageService } from './page.service';

@ApiTags('Page')
@Controller('page')
@UseGuards(RolesGuard)
export class PageController {
  constructor(private readonly pageService: PageService) {}

  /**
   * 創建頁面
   * @param page
   */
  @ApiResponse({ status: 200, description: '創建頁面', type: [Page] })
  @Post()
  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  create(@Body() page) {
    return this.pageService.create(page);
  }

  /**
   * 獲取所有文章
   */
  @Get()
  findAll(@Query() queryParams) {
    return this.pageService.findAll(queryParams);
  }

  /**
   * 獲取指定頁面
   * @param id
   */
  @Get(':id')
  findById(@Param('id') id) {
    return this.pageService.findById(id);
  }

  /**
   * 更新頁面
   * @param id
   * @param page
   */
  @Patch(':id')
  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  updateById(@Param('id') id, @Body() page) {
    return this.pageService.updateById(id, page);
  }

  /**
   * 文章訪問量 +1
   */
  @Post(':id/views')
  @HttpCode(HttpStatus.OK)
  updateViewsById(@Param('id') id) {
    return this.pageService.updateViewsById(id);
  }

  /**
   * 刪除文章
   * @param id
   */
  @Delete(':id')
  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  deleteById(@Param('id') id) {
    return this.pageService.deleteById(id);
  }
}
