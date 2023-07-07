import { Request, Response } from 'express';
import { Locals } from 'express';

export interface LoginBody {
  username: string;
  password: string;
}

export type LoginRequest = Request<never, unknown, LoginBody, never>;

export interface LocalsData extends Locals {
  username: string;
  password: string;
}

export type LoginResponse = Response<unknown, LocalsData>;
