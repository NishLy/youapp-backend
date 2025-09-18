import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/auth.login.dto';

@Controller('api')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() payload: LoginDto) {
    const user = await this.authService.validate(payload);
    return this.authService.login(user);
  }
}
