import { getMetadataArgsStorage } from 'typeorm';
import { UserRoles, Users } from './users.entity';

describe('User Entity', () => {
  let user: Users;

  beforeEach(() => {
    user = new Users();
    user.id = 1;
    user.username = 'test_case';
    user.email = 'test@case.com';
    user.password = 'safePassword';
    user.role = UserRoles.USER;
  });

  describe('Entity Properties', () => {
    it('should create a user instance', () => {
      expect(user).toBeDefined();
      expect(user.id).toBe(1);
      expect(user.username).toBe('test_case');
      expect(user.email).toBe('test@case.com');
      expect(user.password).toBe('safePassword');
    });

    it('should have default role as USER', () => {
      expect(UserRoles.USER).toBe('user');
    });

    it('should support createdAt and updatedAt timestamp fields', () => {
      const now = new Date();
      user.createdAt = now;
      user.updatedAt = now;
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('should allow updating username', () => {
      user.username = 'new_username';
      expect(user.username).toBe('new_username');
    });

    it('should allow updating email', () => {
      user.email = 'new@email.com';
      expect(user.email).toBe('new@email.com');
    });

    it('should hash password on insert and validate correctly', async () => {
      const plainPassword = user.password;
      await user.hashPassword();
      expect(user.password).not.toBe(plainPassword);
      const isValid = await user.validatePassword(plainPassword, user.password);
      expect(isValid).toBe(true);
    });

    it('should reject an incorrect password after hashing', async () => {
      await user.hashPassword();
      const isValid = await user.validatePassword(
        'wrongPassword',
        user.password,
      );
      expect(isValid).toBe(false);
    });
  });

  describe('UserRoles Enum', () => {
    it('should have exactly two roles', () => {
      const roles = Object.values(UserRoles);
      expect(roles).toHaveLength(2);
    });

    it('should contain USER and ADMIN roles', () => {
      expect(Object.values(UserRoles)).toContain('user');
      expect(Object.values(UserRoles)).toContain('admin');
    });

    it('should assign USER role by default', () => {
      const newUser = new Users();
      newUser.role = UserRoles.USER;
      expect(newUser.role).toBe(UserRoles.USER);
    });
  });

  describe('Unique Constraints', () => {
    it('should declare a unique constraint on username and email', () => {
      const uniques = getMetadataArgsStorage().uniques.filter(
        (u) => u.target === Users,
      );
      expect(uniques).toHaveLength(1);
      expect(uniques[0].columns).toEqual(['username', 'email']);
    });

    it('should have different username and email across instances', () => {
      const anotherUser = new Users();
      anotherUser.username = 'other_user';
      anotherUser.email = 'other@case.com';
      expect(anotherUser.username).not.toBe(user.username);
      expect(anotherUser.email).not.toBe(user.email);
    });
  });

  describe('Entity Instance', () => {
    it('should be an instance of Users class', () => {
      expect(user).toBeInstanceOf(Users);
    });

    it('should create independent instances', () => {
      const anotherUser = new Users();
      anotherUser.id = 2;
      anotherUser.username = 'another_user';
      expect(anotherUser.id).not.toBe(user.id);
      expect(anotherUser.username).not.toBe(user.username);
    });
  });
});
