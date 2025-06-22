import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
// import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UserRole } from 'src/users/schemas/user.schema';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN)
  async create(@Body() createUserDto: CreateUserDto) {
    // Map CreateUserDto to User, adding required default properties
    const user: any = {
      ...createUserDto,
      role: 'user', // or appropriate default
      subscriptionPlan: null, // or appropriate default
      watchlist: [],
      orders: [],
      isVerified: false,
    };
    return this.usersService.create(user);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  async findAll() {
    return this.usersService.findAll();
  }

  @Post('upload-profile-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfileImage(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Validasi file (hanya gambar)
    if (!file.mimetype.startsWith('image')) {
      throw new BadRequestException('Only image files are allowed');
    }

    try {
      // Upload ke Cloudinary
      const imageUrl = await this.cloudinaryService.uploadImage(file);

      // Update profileImage di database
      const userId = req.user.userId; // Ambil user ID dari JWT
      await this.usersService.updateProfileImage(userId, imageUrl);

      return {
        message: 'Profile image uploaded successfully',
        imageUrl,
      };
    } catch (error) {
      throw new BadRequestException('Failed to upload image', error);
    }
  }
}
