import { ExecutionContext } from '@nestjs/common';
import { GetUser } from './get-user.decorator';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { UserRoles, Users } from '../../users/entities/users.entity';

// Helper to execute a param decorator and return its value
function getParamDecoratorFactory(decorator: () => ParameterDecorator) {
  class TestController {
    handler(@decorator() _user: Users) {
      return _user;
    }
  }

  const args = Reflect.getMetadata(
    ROUTE_ARGS_METADATA,
    TestController,
    'handler',
  );
  return args[Object.keys(args)[0]].factory;
}

describe('GetUser decorator', () => {
  const mockUser: Users = {
    id: 1,
    username: 'john_doe',
    email: 'john@example.com',
    password: 'hashed_password',
    role: UserRoles.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
    hashPassword: jest.fn(),
    validatePassword: jest.fn(),
  };

  const buildContext = (user: Users | undefined): ExecutionContext =>
    ({
      switchToHttp: () => ({ getRequest: () => ({ user }) }),
    }) as unknown as ExecutionContext;

  it('should return the user from the request', () => {
    const factory = getParamDecoratorFactory(() => GetUser());
    const result = factory(null, buildContext(mockUser));
    expect(result).toEqual(mockUser);
  });

  it('should return undefined when there is no user on the request', () => {
    const factory = getParamDecoratorFactory(() => GetUser());
    const result = factory(null, buildContext(undefined));
    expect(result).toBeUndefined();
  });
});
