import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetFirebaseUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();
    return request.firebaseUser;
  },
);
