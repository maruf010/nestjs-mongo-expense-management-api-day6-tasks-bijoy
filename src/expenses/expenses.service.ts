/* eslint-disable prettier/prettier */
// src/expenses/expenses.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Expense, ExpenseDocument } from './schema/expense.schema';
import { Model, Types } from 'mongoose';
import { CreateExpenseDto } from './schema/dto/create-expense.dto';
import { FilterExpenseDto } from './schema/dto/filter-expense.dto';
import { PaginationDto } from 'src/common/interfaces/dto/pagination.dto';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel(Expense.name) private expModel: Model<ExpenseDocument>,
  ) {}

  async create(dto: CreateExpenseDto) {
    const payload = {
      title: dto.title,
      amount: dto.amount,
      categoryId: new Types.ObjectId(dto.categoryId),
      date: new Date(dto.date),
      note: dto.note,
    };
    const created = new this.expModel(payload);
    return created.save();
  }

  async findAll(filter: FilterExpenseDto, pagination: PaginationDto) {
    const query: any = { isDeleted: false };

    if (filter.categoryId)
      query.categoryId = new Types.ObjectId(filter.categoryId);

    if (filter.month) {
      // parse YYYY-MM into start/end
      const [y, m] = filter.month.split('-').map(Number);
      if (!y || !m) throw new BadRequestException('month must be YYYY-MM');
      const start = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0));
      const end = new Date(Date.UTC(y, m, 1, 0, 0, 0));
      query.date = { $gte: start, $lt: end };
    }

    const page = pagination.getPage();
    const pageSize = pagination.getPageSize(10);
    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      this.expModel
        .find(query)
        .sort({ date: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      this.expModel.countDocuments(query),
    ]);

    return {
      data,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  }
}
