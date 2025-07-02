import { Controller, Get, Post, Body, UseGuards, Req, Delete, Param, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { InterviewsService } from './interviews.service';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestWithUser } from 'src/common/types/request-with-user.interface';

@UseGuards(JwtAuthGuard)
@Controller('interviews')
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  @Post()
  create(@Body() createInterviewDto: CreateInterviewDto) {
    return this.interviewsService.create(createInterviewDto);
  }

  @Get()
  findAll(@Req() req: RequestWithUser) {
    const recruiterId = req.user.id;
    return this.interviewsService.findAllForRecruiter(recruiterId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Return 204 No Content on successful deletion
  remove(@Param('id', ParseIntPipe) id: number) {
    // You might want to add logic here to ensure only the recruiter who created it can delete it.
    return this.interviewsService.remove(id);
  }
}