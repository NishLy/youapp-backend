import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  BadRequestException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CreateProfileDto } from './dtos/profile.create.dto';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dtos/profile.update.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthJWTPayload } from 'src/auth/types/auth';

@Controller('api')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post('register')
  create(@Body() createProfileDto: CreateProfileDto) {
    if (createProfileDto.confirmPassword !== createProfileDto.password)
      throw new BadRequestException("Confirmation Password doesn't match");
    return this.profileService.create(createProfileDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  findByUserId(@Req() req: Request & { user: AuthJWTPayload }) {
    const profileId = req.user.id;
    return this.profileService.findByUserId(profileId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('profile')
  async update(
    @Body() updateProfileDto: UpdateProfileDto,
    @Req() req: Request & { user: AuthJWTPayload },
  ) {
    const profileId = req.user.id;
    return this.profileService.update(profileId, updateProfileDto);
  }
}
