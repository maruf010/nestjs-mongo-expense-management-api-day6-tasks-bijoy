/* eslint-disable prettier/prettier */
// src/expenses/expenses.controller.ts
import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { CreateExpenseDto } from './schema/dto/create-expense.dto';
import { FilterExpenseDto } from './schema/dto/filter-expense.dto';
import { PaginationDto } from 'src/common/interfaces/dto/pagination.dto';
import { ResponsePayload } from 'src/common/interfaces/response-payload.interfaces';
import { ExpensesService } from './expenses.service';

@Controller('expenses')
export class ExpensesController {
  constructor(private svc: ExpensesService) {}

  @Post('create-expense')
  async create(@Body() dto: CreateExpenseDto): Promise<ResponsePayload> {
    const data = await this.svc.create(dto);
    return { success: true, message: 'Expense created', data };
  }

  @Get('get-all-expenses')
  async list(
    @Query() filter: FilterExpenseDto,
    @Query() pagination: PaginationDto,
  ): Promise<ResponsePayload> {
    const res = await this.svc.findAll(filter, pagination);
    return { success: true, data: res.data, meta: res.meta };
  }
}
