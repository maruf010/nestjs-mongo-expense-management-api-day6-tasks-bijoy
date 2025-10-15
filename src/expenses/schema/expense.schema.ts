/* eslint-disable prettier/prettier */
// src/expenses/schema/expense.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ExpenseDocument = Expense & Document;

@Schema({ timestamps: true })
export class Expense {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true, index: true })
  categoryId: Types.ObjectId;

  @Prop({ required: true, type: Date, index: true })
  date: Date;

  @Prop()
  note?: string;

  @Prop({ default: false, index: true })
  isDeleted: boolean;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);

// compound index example: date + category
ExpenseSchema.index({ date: 1, categoryId: 1 });
