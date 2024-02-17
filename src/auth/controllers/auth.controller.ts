import {
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { LocalAuthenticationGuard } from '../guards/local.authentication.guard';
import { Public } from '../decorators/public.decorator';

@ApiTags('Auth')
@UsePipes(
  new ValidationPipe({
    transform: true,
    transformOptions: { enableImplicitConversion: true },
    whitelist: true,
    forbidUnknownValues: true,
  }),
)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  async login(@Request() req) {
    return await this.authService.generateJWT(req.user);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
