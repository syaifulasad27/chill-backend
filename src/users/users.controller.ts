import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
// import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
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
  async findAll() {
    return this.usersService.findAll();
  }
}
