import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService
  ) {
    const name = this.configService.get('ADMIN_USER', 'admin');
    const password = this.configService.get('ADMIN_PASSWD', 'admin');

    this.createUser({ name, password, role: 'admin' })
      .then(() => {
        console.log(`[wipi] 管理員帳戶創建成功，使用者名稱：${name}，密碼：${password}，請及時登錄系統修改默認密碼`);
      })
      .catch(async () => {
        const existAdminUser = await this.userRepository.findOne({ where: { name } });
        const isDefaultPasswd = User.comparePassword(password, existAdminUser.password);
        if (isDefaultPasswd) {
          console.log(`[wipi] 管理員帳戶已經存在，使用者名稱：${name}，密碼：${password}，請及時登錄系統修改默認密碼`);
        }
      });
  }

  async findByConditions(conditions: Partial<User>) {
    return await this.userRepository.findOne(conditions);
  }

  async findAll(queryParams): Promise<[User[], number]> {
    const query = this.userRepository.createQueryBuilder('user').orderBy('user.createAt', 'DESC');

    if (typeof queryParams === 'object') {
      const { page = 1, pageSize = 12, status, ...otherParams } = queryParams;

      query.skip((+page - 1) * +pageSize);
      query.take(+pageSize);

      if (status) {
        query.andWhere('user.status=:status').setParameter('status', status);
      }

      if (otherParams) {
        Object.keys(otherParams).forEach((key) => {
          query.andWhere(`user.${key} LIKE :${key}`).setParameter(`${key}`, `%${otherParams[key]}%`);
        });
      }
    }

    return query.getManyAndCount();
  }

  /**
   * 創建用戶
   * @param user
   */
  async createUser(user: Partial<User>): Promise<User> {
    const { name, password } = user;

    if (!name || !password) {
      throw new HttpException('請輸入使用者名稱和密碼', HttpStatus.BAD_REQUEST);
    }

    const existUser = await this.userRepository.findOne({ where: { name } });

    if (existUser) {
      throw new HttpException('用戶已存在', HttpStatus.BAD_REQUEST);
    }

    const newUser = await this.userRepository.create(user);
    await this.userRepository.save(newUser);
    return newUser;
  }

  /**
   * 用戶登錄
   * @param user
   */
  async login(user: Partial<User>): Promise<User> {
    const { name, password } = user;
    const existUser = await this.userRepository.findOne({ where: { name } });

    if (!existUser || !(await User.comparePassword(password, existUser.password))) {
      throw new HttpException(
        '使用者名稱或密碼錯誤',
        // tslint:disable-next-line: trailing-comma
        HttpStatus.BAD_REQUEST
      );
    }

    if (existUser.status === 'locked') {
      throw new HttpException(
        '用戶已鎖定，無法登錄',
        // tslint:disable-next-line: trailing-comma
        HttpStatus.BAD_REQUEST
      );
    }

    delete existUser.password;

    return existUser;
  }

  /**
   * 無密碼登錄
   * @param user
   */
  async loginWithoutPasswd(user: Partial<User>): Promise<User> {
    const { name } = user;
    const existUser = await this.userRepository.findOne({ where: { name } });

    if (existUser.status === 'locked') {
      throw new HttpException(
        '用戶已鎖定，無法登錄',
        // tslint:disable-next-line: trailing-comma
        HttpStatus.BAD_REQUEST
      );
    }

    delete existUser.password;

    return existUser;
  }

  /**
   * 獲取指定用戶
   * @param id
   */
  async findById(id): Promise<User> {
    return this.userRepository.findOne(id);
  }

  /**
   * 更新指定用戶
   * @param id
   */
  async updateById(currentUser, id, user): Promise<User> {
    if (user.role === 'admin') {
      if (!currentUser || currentUser.role !== 'admin') {
        throw new HttpException(
          '您無權操作',
          // tslint:disable-next-line: trailing-comma
          HttpStatus.FORBIDDEN
        );
      }
    }

    const oldUser = await this.userRepository.findOne(id);
    delete user.password;

    if (user.name && user.name !== oldUser.name) {
      const existUser = await this.userRepository.findOne({ where: { name: user.name } });

      if (existUser) {
        throw new HttpException('用戶已存在', HttpStatus.BAD_REQUEST);
      }
    }

    const newUser = await this.userRepository.merge(oldUser, user);
    return this.userRepository.save(newUser);
  }

  /**
   * 更新指定用戶密碼
   * @param id
   */
  async updatePassword(id, user): Promise<User> {
    const existUser = await this.userRepository.findOne(id);
    const { oldPassword, newPassword } = user;

    if (!existUser || !(await User.comparePassword(oldPassword, existUser.password))) {
      throw new HttpException(
        '使用者名稱或密碼錯誤',
        // tslint:disable-next-line: trailing-comma
        HttpStatus.BAD_REQUEST
      );
    }

    const hashNewPassword = User.encryptPassword(newPassword);
    const newUser = await this.userRepository.merge(existUser, {
      password: hashNewPassword,
    });
    const d = await this.userRepository.save(newUser);
    return d;
  }
}
