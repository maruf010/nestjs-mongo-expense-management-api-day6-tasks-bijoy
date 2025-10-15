/* eslint-disable prettier/prettier */
// src/categories/categories.controller.ts
import { Controller, Post, Body, Get } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from 'src/common/interfaces/dto/create-category.dto';
import { ResponsePayload } from 'src/common/interfaces/response-payload.interfaces';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly svc: CategoriesService) {}

  @Post()
  async create(@Body() dto: CreateCategoryDto): Promise<ResponsePayload> {
    const data = await this.svc.create(dto);
    return { success: true, message: 'Category created', data };
  }

  @Get()
  async list(): Promise<ResponsePayload> {
    const data = await this.svc.findAll();
    return { success: true, data };
  }
}
