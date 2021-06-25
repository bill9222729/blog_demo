import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { Tag } from './tag.entity';
import { TagService } from './tag.service';

@ApiTags('Tag')
@Controller('tag')
@UseGuards(RolesGuard)
export class TagController {
  constructor(private readonly tagService: TagService) {}

  /**
   * 添加標籤
   * @param tag
   */
  @ApiResponse({ status: 200, description: '創建標籤', type: [Tag] })
  @Post()
  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  create(@Body() tag) {
    return this.tagService.create(tag);
  }

  /**
   * 獲取所有標籤
   */
  @Get()
  findAll(@Query() queryParams): Promise<Tag[]> {
    return this.tagService.findAll(queryParams);
  }

  /**
   * 獲取指定標籤
   * @param id
   */
  @Get(':id')
  findById(@Param('id') id) {
    return this.tagService.findById(id);
  }

  /**
   * 獲取指定標籤，包含相關文章訊息
   * @param id
   */
  @Get(':id/article')
  getArticleById(@Param('id') id, @Query('status') status) {
    return this.tagService.getArticleById(id, status);
  }

  /**
   * 更新標籤
   * @param id
   * @param tag
   */
  @Patch(':id')
  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  updateById(@Param('id') id, @Body() tag) {
    return this.tagService.updateById(id, tag);
  }

  /**
   * 刪除標籤
   * @param id
   */
  @Delete(':id')
  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  deleteById(@Param('id') id) {
    return this.tagService.deleteById(id);
  }
}
