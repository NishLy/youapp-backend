import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Req,
  Post,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dtos/profile.update.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthJWTPayload } from 'src/auth/types/auth';
import { CreateProfileDto } from './dtos/profile.create.dto';

@Controller('api')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('getProfile')
  findByUserId(@Req() req: Request & { user: AuthJWTPayload }) {
    const profileId = req.user.id;
    return this.profileService.findByUserId(profileId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('updateProfile')
  async update(
    @Body() updateProfileDto: UpdateProfileDto,
    @Req() req: Request & { user: AuthJWTPayload },
  ) {
    const profileId = req.user.id;
    return this.profileService.update(profileId, updateProfileDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('createProfile')
  async create(
    @Body() CreateProfileDto: CreateProfileDto,
    @Req() req: Request & { user: AuthJWTPayload },
  ) {
    const profileId = req.user.id;
    return this.profileService.create(profileId, CreateProfileDto);
  }
}
