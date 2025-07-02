// backend/src/users/users.service.ts
// --- FIX: Add 'NotFoundException' to this import ---
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../auth/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // ... (findRecommendations and findAllCandidates methods remain the same) ...
  async findRecommendations(limit: number, currentUserId?: number): Promise<User[]> {
    try {
      const queryBuilder = this.userRepository.createQueryBuilder('user')
        .leftJoinAndSelect('user.candidateProfile', 'candidateProfile')
        .leftJoinAndSelect('user.recruiterProfile', 'recruiterProfile')
        .addSelect('RANDOM()', 'random')
        .orderBy('random')
        .take(limit);

      if (currentUserId) {
        queryBuilder.where('user.id != :currentUserId', { currentUserId });
      }

      const users = await queryBuilder.getMany();
    
      return users.map(user => {
        const { password, resetPasswordToken, resetPasswordExpires, random, ...safeUser } = user as any;
        return safeUser as User;
      });

    } catch (error) {
      console.error('Error fetching user recommendations:', error);
      throw new InternalServerErrorException('Could not fetch user recommendations.');
    }
  }

  async findAllCandidates(): Promise<User[]> {
    try {
      const candidates = await this.userRepository.find({
        where: { role: UserRole.CANDIDATE },
        relations: ['candidateProfile'],
      });
      return candidates.map(user => {
        const { password, resetPasswordToken, resetPasswordExpires, ...safeUser } = user;
        return safeUser as User;
      });
    } catch (error) {
      console.error('Error fetching all candidates:', error);
      throw new InternalServerErrorException('Could not fetch candidates.');
    }
  }
  
  /**
   * Finds a single user's public profile by their ID.
   * @param id The ID of the user to find.
   * @returns The user object without sensitive information.
   */
  async findPublicProfileById(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['candidateProfile', 'recruiterProfile'], 
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found.`);
      }

      const { password, resetPasswordToken, resetPasswordExpires, ...safeUser } = user;
      return safeUser as User;
    } catch (error) {
      console.error(`Error fetching profile for user ID ${id}:`, error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Could not fetch user profile.');
    }
  }
}