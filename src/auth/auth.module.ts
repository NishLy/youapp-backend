import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ProfileModule } from 'src/profile/profile.module';
import { JwtStrategy } from './auth.jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: 'super-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
    ProfileModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtModule],
})
export class AuthModule {}
