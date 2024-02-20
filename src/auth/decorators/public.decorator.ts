import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
/**
 * marks route methods to be public, so authentication will be skipped for them
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
