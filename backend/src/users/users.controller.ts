// backend/src/users/users.controller.ts
// --- FIX: Add 'Param' to this import ---
import { Controller, Get, Query, Param, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestWithUser } from 'src/common/types/request-with-user.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Endpoint to get user recommendations.
   * It's protected by JwtAuthGuard to know who the current user is.
   */
  @UseGuards(JwtAuthGuard)
  @Get('recommendations')
  async findRecommendations(
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 3,
    @Req() req: RequestWithUser,
  ) {
    const currentUserId = req.user?.id;
    return this.usersService.findRecommendations(limit, currentUserId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('candidates')
  async findAllCandidates() {
    return this.usersService.findAllCandidates();
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile/:id')
  async findOneUserProfile(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findPublicProfileById(id);
  }
}