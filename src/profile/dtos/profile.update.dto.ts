import {
  IsString,
  IsOptional,
  IsEnum,
  IsDate,
  IsArray,
  IsNumber,
} from 'class-validator';
import { GenderEnum } from 'src/common/enum/gender';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  displayName: string;

  @IsEnum(GenderEnum)
  @IsOptional()
  gender;

  @IsDate()
  @IsOptional()
  birthDate;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  interests;

  @IsNumber()
  @IsOptional()
  height;

  @IsNumber()
  @IsOptional()
  weight;
}
