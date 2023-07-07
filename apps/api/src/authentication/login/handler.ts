import { LoginRequest, LoginResponse } from './dto';
import { starlinkDb, user } from '../../db/schema/starspace';
import { eq } from 'drizzle-orm';

const handler = async (req: LoginRequest, _res: LoginResponse) => {
  const { username, password } = req.body;
  const resUser = await starlinkDb.select().from(user).where(eq(user.username, username));
  if (resUser.length === 0) {
};

export default handler;
