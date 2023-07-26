import { Request, Response } from 'express';
import { Locals } from 'express';

export interface RawDataQuery {
  serviceLine: string;
  month: string;
  year: string;
}

export type RawDataRequest = Request<never, unknown, never, RawDataQuery>;

export interface LocalsData extends Locals {
  serviceLine: string;
  month: number;
  year: number;
}

export type RawDataResponse = Response<unknown, LocalsData>;
