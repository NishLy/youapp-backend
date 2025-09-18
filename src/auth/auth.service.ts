import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dtos/auth.login.dto';
import { ProfileService } from 'src/profile/profile.service';
import { Profile } from 'src/profile/schemas/profile.schema';
import { isEmail } from 'class-validator';
import { comparePassword } from 'src/utils/hash';
import { AuthJWTPayload } from './types/auth';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private profileService: ProfileService,
    private jwtService: JwtService,
  ) {}

  async validate(login: LoginDto): Promise<Profile & { _id: string }> {
    let profile: Profile | null = null;

    if (isEmail(login.usernameOrEmail)) {
      profile = await this.profileService.findByEmail(
        login.usernameOrEmail,
        true,
      );
    } else {
      profile = await this.profileService.findByUserName(
        login.usernameOrEmail,
        true,
      );
    }

    if (profile && (await comparePassword(login.password, profile.password))) {
      return profile as Profile & { _id: string };
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  login(profile: Profile & { _id: string }) {
    const payload: AuthJWTPayload = {
      id: profile._id,
      email: profile.email,
      username: profile.userName,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
