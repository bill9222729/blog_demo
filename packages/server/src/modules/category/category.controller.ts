import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { Category } from './category.entity';
import { CategoryService } from './category.service';

@ApiTags('Category')
@Controller('category')
@UseGuards(RolesGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  /**
   * 添加標籤
   * @param category
   */
  @ApiResponse({ status: 200, description: '添加分類', type: [Category] })
  @Post()
  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  create(@Body() category) {
    return this.categoryService.create(category);
  }

  /**
   * 獲取所有標籤
   */
  @Get()
  findAll(@Query() queryParams): Promise<Category[]> {
    return this.categoryService.findAll(queryParams);
  }

  /**
   * 獲取指定標籤
   * @param id
   */
  @Get(':id')
  findById(@Param('id') id) {
    return this.categoryService.findById(id);
  }

  /**
   * 更新標籤
   * @param id
   * @param category
   */
  @Patch(':id')
  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  updateById(@Param('id') id, @Body() category) {
    return this.categoryService.updateById(id, category);
  }

  /**
   * 刪除標籤
   * @param id
   */
  @Delete(':id')
  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  deleteById(@Param('id') id) {
    return this.categoryService.deleteById(id);
  }
}
