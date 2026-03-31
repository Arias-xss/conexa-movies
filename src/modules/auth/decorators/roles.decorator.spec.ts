import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY, Roles } from './roles.decorator';
import { UserRoles } from '../../users/entities/users.entity';

jest.mock('@nestjs/common', () => ({
  ...jest.requireActual('@nestjs/common'),
  SetMetadata: jest.fn(() => jest.fn()),
}));

describe('Roles decorator', () => {
  it('should call SetMetadata with the correct key and roles', () => {
    const roles = [UserRoles.ADMIN, UserRoles.USER];
    Roles(...roles);

    expect(SetMetadata).toHaveBeenCalledWith(ROLES_KEY, roles);
  });

  it('should use "roles" as the metadata key', () => {
    expect(ROLES_KEY).toBe('roles');
  });
});
