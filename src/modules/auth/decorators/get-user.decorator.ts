import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Users } from '../../users/entities/users.entity';
import { Request } from 'express';

export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): Users | undefined => {
    const req: Request & { user: Users | undefined } = ctx
      .switchToHttp()
      .getRequest();

    return req.user;
  },
);
