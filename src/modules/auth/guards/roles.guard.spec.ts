import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { RolesGuard } from './roles.guard';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRoles, Users } from '../../users/entities/users.entity';

const buildContext = (user: Partial<Users> | undefined): ExecutionContext =>
  ({
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: () => ({ getRequest: () => ({ user }) }),
  }) as unknown as ExecutionContext;

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RolesGuard, Reflector],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should allow access when no roles are required', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

    const result = guard.canActivate(buildContext(undefined));

    expect(result).toBe(true);
  });

  it('should allow access when roles array is empty', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([]);

    const result = guard.canActivate(buildContext(undefined));

    expect(result).toBe(true);
  });

  it('should allow access when user has the required role', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([UserRoles.ADMIN]);

    const result = guard.canActivate(
      buildContext({ role: UserRoles.ADMIN } as Users),
    );

    expect(result).toBe(true);
  });

  it('should deny access when user does not have the required role', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([UserRoles.ADMIN]);

    const result = guard.canActivate(
      buildContext({ role: UserRoles.USER } as Users),
    );

    expect(result).toBe(false);
  });

  it('should deny access when there is no user on the request', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([UserRoles.ADMIN]);

    const result = guard.canActivate(buildContext(undefined));

    expect(result).toBe(false);
  });

  it('should pass the correct metadata key and handlers to the reflector', () => {
    const getAllAndOverrideSpy = jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([UserRoles.USER]);
    const ctx = buildContext({ role: UserRoles.USER } as Users);

    guard.canActivate(ctx);

    expect(getAllAndOverrideSpy).toHaveBeenCalledWith(ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
  });
});
