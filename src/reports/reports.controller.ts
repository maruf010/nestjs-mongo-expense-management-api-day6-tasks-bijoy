/* eslint-disable prettier/prettier */
// src/reports/reports.controller.ts
import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExpenseDocument } from '../expenses/schema/expense.schema';
import { ResponsePayload } from 'src/common/interfaces/response-payload.interfaces';

@Controller('reports')
export class ReportsController {
  constructor(
    @InjectModel('Expense') private expModel: Model<ExpenseDocument>,
  ) {}

  @Get('summary')
  async monthlySummary(
    @Query('month') month: string,
  ): Promise<ResponsePayload> {
    if (!month) throw new BadRequestException('month is required as YYYY-MM');

    const [y, m] = month.split('-').map(Number);
    if (!y || !m) throw new BadRequestException('month must be YYYY-MM');

    const start = new Date(Date.UTC(y, m - 1, 0, 0, 0, 0));
    start.setUTCDate(1);
    const end = new Date(Date.UTC(y, m, 1, 0, 0, 0));

    // aggregation pipeline
    const match = {
      $match: { date: { $gte: start, $lt: end }, isDeleted: false },
    };

    // total sum
    const totalResult = await this.expModel.aggregate([
      match,
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const categoryResult = await this.expModel.aggregate([
      match,
      { $group: { _id: '$categoryId', total: { $sum: '$amount' } } },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category',
        },
      },
      { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          categoryId: '$_id',
          categoryName: '$category.name',
          total: 1,
        },
      },
      { $sort: { total: -1 } },
    ]);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const total = (totalResult[0] && totalResult[0].total) || 0;
    return {
      success: true,
      data: {
        month,
        total,
        byCategory: categoryResult,
      },
    };
  }
}
