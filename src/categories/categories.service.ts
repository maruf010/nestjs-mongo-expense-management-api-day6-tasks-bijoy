/* eslint-disable prettier/prettier */
// src/categories/categories.service.ts
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schema/category.schema';
import { CreateCategoryDto } from 'src/common/interfaces/dto/create-category.dto';
import { slugify } from 'src/utils/slugify';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private catModel: Model<CategoryDocument>,
  ) {}

  async create(dto: CreateCategoryDto) {
    const slug = dto.slug || slugify(dto.name);
    const exists = await this.catModel
      .findOne({ slug, isDeleted: false })
      .lean();
    if (exists) throw new ConflictException('Category already exists');
    const created = new this.catModel({ name: dto.name, slug });
    return created.save();
  }

  async findAll() {
    return this.catModel.find({ isDeleted: false }).sort({ name: 1 }).lean();
  }

  async findById(id: string) {
    const c = await this.catModel.findById(id).lean();
    if (!c || c.isDeleted) throw new NotFoundException('Category not found');
    return c;
  }
}
