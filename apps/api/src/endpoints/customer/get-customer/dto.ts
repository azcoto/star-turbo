import { Request, Response } from 'express';
import { Locals } from 'express';

export interface CustomerParams {
  uuid: string;
}

export type CustomerRequest = Request<CustomerParams, unknown, never, never>;

export interface LocalsData extends Locals {
  uuid: string;
}

export type CustomerResponse = Response<unknown, LocalsData>;
