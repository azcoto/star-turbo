import { LoginRequest, LoginResponse } from './dto';
import { starspaceDb, user } from '../../db/schema/starspace';
import { DrizzleError, and, eq } from 'drizzle-orm';
import { NextFunction } from 'express';
import { ApiError } from '../../api-error';
import { compare } from 'bcrypt';

const handler = async (req: LoginRequest, res: LoginResponse, next: NextFunction) => {
  const { username, password } = req.body;
  try {
    // prettier-ignore
    const resUser = await starspaceDb
    .select({
      username: user.username,
      password: user.password,
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

    return res.status(200).json({
      data: resUser,
    });
  } catch (err) {
    if (err instanceof DrizzleError) {
      return next(new ApiError('ORM Error', 500, { message: err.message }));
    }
    return next(new ApiError('Internal Server Error', 500, { message: err }));
  }
};

export default handler;
