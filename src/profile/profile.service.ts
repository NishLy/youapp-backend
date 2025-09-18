import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile, ProfileDocument } from './schemas/profile.schema';
import { CreateProfileDto } from './dtos/profile.create.dto';
import { UpdateProfileDto } from './dtos/profile.update.dto';
import { calculateHoroscope, calculateZodiac } from 'src/utils/zodiac/helper';

@Injectable()
export class profileService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
  ) {}

  async create(profile: CreateProfileDto): Promise<Profile> {
    const newProfile = new this.profileModel(profile);
    return newProfile.save();
  }

  async findByUserId(userId: string): Promise<Profile> {
    const profile = await this.profileModel.findOne({ userId }).exec();
    if (!profile) throw new NotFoundException('Profile not found');
    return profile;
  }

  async update(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    const updatePayload: any = { ...updateProfileDto };

    if (updateProfileDto.birthDate) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      updatePayload.horoscope = calculateHoroscope(
        new Date(updateProfileDto.birthDate as Date),
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      updatePayload.zodiac = calculateZodiac(
        new Date(updateProfileDto.birthDate as Date),
      );
    }

    const profile = await this.profileModel.findOneAndUpdate(
      { userId },
      { $set: updateProfileDto },
      { new: true },
    );

    if (!profile) throw new NotFoundException('Profile not found');
    return profile;
  }
}
