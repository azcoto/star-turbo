import { Request, Response } from 'express';
import { Locals } from 'express';

export interface TelemetryQuery {
  idNode: string;
  start: string;
  end: string;
}

export type TelemetryRequest = Request<never, unknown, never, TelemetryQuery>;

export interface LocalsData extends Locals {
  idNode: string;
  start: number;
  end: number;
}

export type TelemetryResponse = Response<unknown, LocalsData>;
