/* eslint-disable prettier/prettier */
// src/categories/schema/category.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true, trim: true, index: true })
  name: string;

  @Prop({ required: true, lowercase: true, trim: true, unique: true })
  slug: string;

  @Prop({ default: false, index: true })
  isDeleted: boolean;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

// ensure text index on name for fast search (optional)
CategorySchema.index({ name: 'text' });
