import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { CreateProfileDto } from './dtos/profile.create.dto';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dtos/profile.update.dto';

@Controller('api')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post('register')
  create(@Body() createProfileDto: CreateProfileDto) {
    if (createProfileDto.confirmPassword !== createProfileDto.password)
      throw new BadRequestException("Confirmation Password doesn't match");
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
