/* eslint-disable prettier/prettier */
import { IsOptional, IsNumberString } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  pageSize?: string;

  getPage() {
    return Math.max(1, parseInt(this.page || '1', 10));
  }

  getPageSize(defaultSize = 10) {
    return Math.max(1, parseInt(this.pageSize || String(defaultSize), 10));
  }
}
