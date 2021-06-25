import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { Comment } from './comment.entity';
import { CommentService } from './comment.service';

@ApiTags('Comment')
@Controller('comment')
@UseGuards(RolesGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  /**
   * 創建評論
   * @param comment
   */
  @ApiResponse({ status: 200, description: '創建評論', type: [Comment] })
  @Post()
  create(@Request() req, @Body() comment) {
    const userAgent = req.headers['user-agent'];
    return this.commentService.create(userAgent, comment);
  }

  /**
   * 獲取所有評論
   */
  @Get()
  findAll(@Query() queryParams) {
    return this.commentService.findAll(queryParams);
  }

  /**
   * 獲取指定評論
   * @param id
   */
  @Get(':id')
  findById(@Param('id') id) {
    return this.commentService.findById(id);
  }

  /**
   * 獲取文章或頁面評論
   * @param hostId
   */
  @Get('host/:hostId')
  getArticleComments(@Param('hostId') hostId, @Query() qurey) {
    return this.commentService.getArticleComments(hostId, qurey);
  }

  /**
   * 更新評論
   * @param id
   * @param tag
   */
  @Patch(':id')
  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  updateById(@Param('id') id, @Body() data) {
    return this.commentService.updateById(id, data);
  }

  /**
   * 刪除評論
   * @param id
   */
  @Delete(':id')
  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  deleteById(@Param('id') id) {
    return this.commentService.deleteById(id);
  }
}
