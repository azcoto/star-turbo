import { LoginRequest, LoginResponse } from './dto';
import { dbStarspace, user } from '@/db/schema/starspace';
import { DrizzleError, and, eq, sql } from 'drizzle-orm';
import { NextFunction } from 'express';
import { ApiError } from '@/api-error';
import { compare } from 'bcryptjs';
import { encodeAccessToken } from '@/utils';

const handler = async (req: LoginRequest, res: LoginResponse, next: NextFunction) => {
  const { username, password } = req.body;
  try {
    // prettier-ignore
    const resUser = await dbStarspace
    .select({
      username: user.username,
      uuid: user.uuid,
      password: user.password,
      fullname: user.fullName,
      email: user.email,
      address: user.address,
      phone: user.phone,
    })
    .from(user)
    .where(
      and(
        eq(user.username, username),
        eq(user.isActive, true),
      )
    );

    if (resUser.length === 0) {
      return next(new ApiError('Username / Password Wrong', 400, { username: username }));
    }

    const passCheck = await compare(password, resUser[0].password);

    if (!passCheck) return next(new ApiError('Username / Password Wrong', 400, { username: username }));
    const { password: _, ...payload } = resUser[0];
    // enocde access token resUser[0] without password

    return res.status(200).json({
      success: true,
      message: 'Login Success',
      data: {
        ...payload,
        accessToken: encodeAccessToken(payload),
      },
    });
  } catch (err) {
    if (err instanceof DrizzleError) {
      return next(new ApiError('ORM Error', 500, { message: err.message }));
    }
    if (err instanceof Error) return next(new ApiError('Internal Server Error', 500, { message: err.message }));
  }
};

export default handler;
