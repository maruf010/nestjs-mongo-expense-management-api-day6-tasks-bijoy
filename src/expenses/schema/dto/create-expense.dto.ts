/* eslint-disable prettier/prettier */
// src/expenses/dto/create-expense.dto.ts
import {
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsOptional,
  IsMongoId,
  IsString,
} from 'class-validator';

export class CreateExpenseDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  amount: number;

  @IsMongoId()
  categoryId: string;

  @IsDateString()
  date: string; // ISO date

  @IsOptional()
  @IsString()
  note?: string;
}
