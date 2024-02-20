import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../users/entities/user.entity';

export const ROLES_KEY = 'roles';
/**
 * marks route methods with user roles that have the authorization to call them
 * @param roles - users' roles
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
