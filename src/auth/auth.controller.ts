import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/auth.login.dto';
import { AuthRegisterDto } from './dtos/auth.register.dto';

@Controller('api')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() payload: LoginDto) {
    const user = await this.authService.validate(payload);
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() data: AuthRegisterDto) {
    if (data.confirmPassword !== data.password)
      throw new BadRequestException("Confirmation Password doesn't match");
    return await this.authService.register(data);
  }
}
