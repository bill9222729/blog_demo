import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { User } from './user.entity';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
@UseGuards(RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

  @ApiResponse({ status: 200, description: '獲取用戶列表', type: [User] })
  @ApiResponse({ status: 403, description: '無權獲取用戶列表' })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  findAll(@Query() query) {
    return this.userService.findAll(query);
  }

  /**
   * 用戶註冊
   * @param user
   */
  @ApiResponse({ status: 201, description: '創建用戶', type: [User] })
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() user: Partial<User>): Promise<User> {
    const d = await this.userService.createUser(user);
    return d;
  }

  async checkPermission(req, user) {
    let token = req.headers.authorization;

    if (!token) {
      throw new HttpException('未認證', HttpStatus.UNAUTHORIZED);
    }

    if (/Bearer/.test(token)) {
      // 不需要 Bearer，否則驗證失敗
      token = token.split(' ').pop();
    }
    const tokenUser = this.jwtService.decode(token) as User;
    const id = tokenUser.id;

    if (!id) {
      throw new HttpException('未認證', HttpStatus.UNAUTHORIZED);
    }

    const exist = await this.userService.findById(id);
    if (exist.id !== user.id && exist.role !== 'admin') {
      throw new HttpException('無權處理', HttpStatus.FORBIDDEN);
    }

    req.user = tokenUser;
  }

  /**
   * 用戶更新
   * @param user
   */
  @ApiResponse({ status: 200, description: '更新用戶成功', type: [User] })
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('update')
  @HttpCode(HttpStatus.CREATED)
  async update(@Request() req, @Body() user: Partial<User>): Promise<User> {
    await this.checkPermission(req, user);
    const d = await this.userService.updateById(req.user, user.id, user);
    return d;
  }

  /**
   * 更新用戶密碼
   * @param user
   */
  @ApiResponse({ status: 201, description: '更新密碼成功', type: [User] })
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('password')
  @HttpCode(HttpStatus.CREATED)
  async updatePassword(@Request() req, @Body() user: Partial<User>): Promise<User> {
    await this.checkPermission(req, user);
    const d = await this.userService.updatePassword(user.id, user);
    return d;
  }
}
