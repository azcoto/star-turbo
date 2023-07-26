import { Request, Response, Locals } from 'express';

export interface ServiceLineParams {
  serviceLineNumber: string;
}

export type ServiceLineRequest = Request<ServiceLineParams, unknown, never, never>;

export interface LocalData extends Locals {
  serviceLineNumber: string;
}

export type ServiceLineResponse = Response<unknown, LocalData>;
