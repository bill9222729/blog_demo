import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { parseIp } from '../../utils/ip.util';
import { parseUserAgent } from '../../utils/ua.util';
import { View } from './view.entity';

@Injectable()
export class ViewService {
  constructor(
    @InjectRepository(View)
    private readonly viewRepository: Repository<View>
  ) {}

  /**
   * 添加訪問
   * @param tag
   */
  async create(ip: string, userAgent: string, url: string): Promise<View> {
    const exist = await this.viewRepository.findOne({
      where: { ip, userAgent, url },
    });
    if (exist) {
      const count = exist.count;
      const newData = await this.viewRepository.merge(exist, {
        count: count + 1,
      });
      await this.viewRepository.save(newData);
      return newData;
    }
    const { data: uaInfo } = parseUserAgent(userAgent);
    const address = parseIp(ip);
    const newData = await this.viewRepository.create({ ip, userAgent, url, address, ...uaInfo });
    await this.viewRepository.save(newData);
    return newData;
  }

  /**
   * 獲取所有訪問
   */
  async findAll(queryParams): Promise<[View[], number]> {
    const query = this.viewRepository.createQueryBuilder('view').orderBy('view.createAt', 'DESC');
    if (typeof queryParams === 'object') {
      const { page = 1, pageSize = 12, ...otherParams } = queryParams;
      query.skip((+page - 1) * +pageSize);
      query.take(+pageSize);

      if (otherParams) {
        Object.keys(otherParams).forEach((key) => {
          query.andWhere(`view.${key} LIKE :${key}`).setParameter(`${key}`, `%${otherParams[key]}%`);
        });
      }
    }

    return query.getManyAndCount();
  }

  /**
   * 查找指定路徑訪問統計
   * @param url
   */
  async findByUrl(url): Promise<View[]> {
    return this.viewRepository.find({
      where: { url },
      order: { updateAt: 'ASC' },
    });
  }

  /**
   * 獲取指定訪問
   * @param id
   */
  async findById(id): Promise<View> {
    return this.viewRepository.findOne(id);
  }

  /**
   * 刪除訪問量
   * @param id
   */
  async deleteById(id) {
    const data = await this.viewRepository.findOne(id);
    return this.viewRepository.remove(data);
  }
}
