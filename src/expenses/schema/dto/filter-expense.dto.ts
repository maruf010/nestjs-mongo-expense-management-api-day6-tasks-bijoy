/* eslint-disable prettier/prettier */
// src/expenses/dto/filter-expense.dto.ts
import { IsOptional, IsMongoId, IsString } from 'class-validator';

export class FilterExpenseDto {
  @IsOptional()
  @IsMongoId()
  categoryId?: string;

  @IsOptional()
  @IsString()
  month?: string; // format YYYY-MM, e.g. 2025-10

  // pagination params taken from query can use PaginationDto
}
