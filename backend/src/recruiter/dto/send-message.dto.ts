import { IsString, IsInt } from 'class-validator';

export class SendMessageDto {
  @IsInt()
  receiverId: number;

  @IsString()
  content: string;
}