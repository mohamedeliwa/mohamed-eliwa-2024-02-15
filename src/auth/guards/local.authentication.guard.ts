import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * A guard for local authentication
 */
@Injectable()
export class LocalAuthenticationGuard extends AuthGuard('local') {}
