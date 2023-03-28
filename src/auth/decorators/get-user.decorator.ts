import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from '../entities/user.entity';

export const GetUser = createParamDecorator<'email' | null>(
  (data, ctx: ExecutionContext): User | string => {
    const req = ctx.switchToHttp().getRequest();
    const user: User = req.user;
    if (!user)
      throw new InternalServerErrorException('User not found (request)');
    if (data === 'email') return user.email;
    return user;
  },
);
