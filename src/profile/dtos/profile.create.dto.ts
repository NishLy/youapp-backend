import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateProfileDto {
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  interests;
}
