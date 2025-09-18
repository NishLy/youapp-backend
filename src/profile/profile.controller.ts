import { Controller, Post, Get, Put, Body, Param } from '@nestjs/common';
import { CreateProfileDto } from './dtos/profile.create.dto';
import { profileService } from './profile.service';
import { UpdateProfileDto } from './dtos/profile.update.dto';

@Controller('api')
export class ProfileController {
  constructor(private readonly profileService: profileService) {}

  @Post('register')
  create(@Body() createProfileDto: CreateProfileDto) {
    return this.profileService.create(createProfileDto);
  }

  @Get('profile')
  findByUserId(@Param('userId') userId: string) {
    return this.profileService.findByUserId(userId);
  }

  @Put('profile')
  update(
    @Param('userId') userId: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profileService.update(userId, updateProfileDto);
  }
}
