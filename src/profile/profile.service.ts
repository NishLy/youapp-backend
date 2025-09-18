import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile, ProfileDocument } from './schemas/profile.schema';
import { CreateProfileDto } from './dtos/profile.create.dto';
import { UpdateProfileDto } from './dtos/profile.update.dto';
import { calculateHoroscope, calculateZodiac } from 'src/utils/zodiac/helper';
import { hashPassword } from 'src/utils/hash';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
  ) {}

  async create(profile: CreateProfileDto): Promise<Profile> {
    profile.password = await hashPassword(profile.password);

    const newProfile = new this.profileModel(profile);
    return newProfile.save();
  }

  async findByUserId(userId: string): Promise<Profile> {
    const profile = await this.profileModel.findOne({ userId }).exec();
    if (!profile) throw new NotFoundException('Profile not found');
    return profile;
  }

  async findByEmail(email: string, includePassword?: boolean) {
    let query = this.profileModel.findOne({ email });

    if (includePassword) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      query = query.select('+password');
    }

    const profile = await query.exec();

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }

  async findByUserName(userName: string, includePassword?: boolean) {
    let query = this.profileModel.findOne({ userName });

    if (includePassword) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      query = query.select('+password');
    }

    const profile = await query.exec();
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
