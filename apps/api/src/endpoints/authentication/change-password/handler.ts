import { ChangePasswordRequest, ChangePasswordResponse } from './dto';
import { dbStarspace, user } from '@/db/schema/starspace';
import { DrizzleError, and, eq, sql } from 'drizzle-orm';
import { NextFunction } from 'express';
import { ApiError } from '@/api-error';
import bcrypt from 'bcryptjs';
import { encodeAccessToken } from '@/utils';

const { compare } = bcrypt;

const handler = async (req: ChangePasswordRequest, res: ChangePasswordResponse, next: NextFunction) => {
  const { uuid, oldPassword, newPassword } = req.body;
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
        eq(user.uuid, uuid),
    );

    if (resUser.length === 0) {
      return next(new ApiError('Username / Password Wrong', 400, { uuid: uuid }));
    }

    const passCheck = await compare(oldPassword, resUser[0].password);

    if (!passCheck) return next(new ApiError('Username / Password Wrong', 400, { uuid: uuid }));
    const hash = await bcrypt.hash(newPassword, 10);
    await dbStarspace
      .update(user)
      .set({
        password: hash,
      })
      .where(eq(user.uuid, uuid));

    // enocde access token resUser[0] without password

    return res.status(200).json({
      success: true,
      message: 'Password Updated',
    });
  } catch (err) {
    if (err instanceof DrizzleError) {
      return next(new ApiError('ORM Error', 500, { message: err.message }));
    }
    if (err instanceof Error) return next(new ApiError('Internal Server Error', 500, { message: err.message }));
  }
};

export default handler;
