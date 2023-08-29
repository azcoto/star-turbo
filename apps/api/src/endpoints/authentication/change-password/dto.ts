import { Request, Response } from 'express';
import { Locals } from 'express';

export interface ChangePasswordBody {
  uuid: string;
  oldPassword: string;
  newPassword: string;
}

export type ChangePasswordRequest = Request<never, unknown, ChangePasswordBody, never>;

export interface LocalsData extends Locals {
  uuid: string;
  oldPassword: string;
  newPassword: string;
}

export type ChangePasswordResponse = Response<unknown, LocalsData>;
