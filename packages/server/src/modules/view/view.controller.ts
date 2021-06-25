import { Body, Controller, Delete, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { getClientIP } from '../../utils/ip.util';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { View } from './view.entity';
import { ViewService } from './view.service';

@ApiTags('View')
@Controller('view')
@UseGuards(RolesGuard)
export class ViewController {
  constructor(private readonly viewService: ViewService) {}

  /**
   * 添加訪問
   * @param tag
   */
  @ApiResponse({ status: 200, description: '訪問記錄添加成功', type: [View] })
  @Post()
  create(@Request() req, @Body() data) {
    const userAgent = req.headers['user-agent'];
    const url = data.url;
    return this.viewService.create(getClientIP(req), userAgent, url);
  }

  /**
   * 獲取所有訪問
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query() queryParam) {
    return this.viewService.findAll(queryParam);
  }

  /**
   * 獲取指定訪問
   * @param id
   */
  @Get('/url')
  findByUrl(@Query('url') url) {
    return this.viewService.findByUrl(url);
  }

  /**
   * 獲取指定訪問
   * @param id
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findById(@Param('id') id) {
    return this.viewService.findById(id);
  }

  /**
   * 刪除訪問
   * @param id
   */
  @Delete(':id')
  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  deleteById(@Param('id') id) {
    return this.viewService.deleteById(id);
  }
}
