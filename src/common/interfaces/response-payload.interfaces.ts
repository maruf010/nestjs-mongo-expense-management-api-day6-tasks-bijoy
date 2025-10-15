/* eslint-disable prettier/prettier */
export interface ResponsePayload<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: any;
}
