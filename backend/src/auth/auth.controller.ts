import {
  Controller,
  Post,
  Body,
  Get,
  HttpCode,
  HttpStatus,
  Delete,
  UseGuards,
  Req,
  SetMetadata,
  Res,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { Response } from 'express'; 
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RoleGuard } from './guards/role.guard';
import { UserRole } from './entities/user.entity';
import { BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from '../common/types/request-with-user.interface';
import { UpdateUserDto } from './dto/update-user.dto'; 
import { Patch } from '@nestjs/common';

// Helper function to create folders if they don't exist
const createFolderIfNotExists = (folderPath: string) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // --- Google OAuth ---
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: RequestWithUser, @Res() res: Response) {
    const { token } = await this.authService.handleGoogleAuth(req.user as any);

    const redirectUrl = `http://localhost:3001/auth/callback?token=${token}`;
    res.redirect(redirectUrl);
  }

  // --- Standard Auth ---
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const { password, ...safeUser } = await this.authService.register(registerDto);
    return safeUser;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) throw new BadRequestException('Invalid credentials');
    return this.authService.login(user);
  }

  // --- Password Management ---
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  // --- User Account Management ---
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body('token') token: string) {
    await this.authService.logout(token);
    return { message: 'Logout successfully' };
  }

  @Delete('account')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @SetMetadata('role', [UserRole.RECRUITER, UserRole.CANDIDATE])
  @HttpCode(HttpStatus.OK)
  async deleteAccount(@Req() req: RequestWithUser) {
    return this.authService.deleteAccount(req.user.id);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  updateUserInfo(@Req() req: RequestWithUser, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.updateUser(req.user.id, updateUserDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: RequestWithUser) {
    return this.authService.getProfile(req.user.id);
  }

  // --- Image Upload Endpoint for Profile Pictures ---
  @Post('upload-profile-picture')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req: RequestWithUser, file, cb) => {
        const roleFolder = req.user.role === UserRole.CANDIDATE ? 'candidates' : 'recruiters';
        const path = `./uploads/${roleFolder}`;
        createFolderIfNotExists(path);
        cb(null, path);
      },
      filename: (req: RequestWithUser, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `user-${req.user.id}-profile-pic-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file || !file.originalname) {
        return cb(new Error('Invalid file upload request.'), false);
      }
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
    },
  }))
  async uploadProfilePicture(
    @Req() req: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.authService.updateProfileImage(req.user, 'profilePicture', file.path);
  }

  // --- Image Upload Endpoint for Cover Photos ---
  @Post('upload-cover-photo')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req: RequestWithUser, file, cb) => {
        const roleFolder = req.user.role === UserRole.CANDIDATE ? 'candidates' : 'recruiters';
        const path = `./uploads/${roleFolder}`;
        createFolderIfNotExists(path);
        cb(null, path);
      },
      filename: (req: RequestWithUser, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `user-${req.user.id}-cover-photo-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file || !file.originalname) {
        return cb(new Error('Invalid file upload request.'), false);
      }
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
    },
  }))
  async uploadCoverPhoto(
    @Req() req: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.authService.updateProfileImage(req.user, 'coverPhoto', file.path);
  }
}