import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Headers,
  Header,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { GetUser } from './decorators/get-user.decorator';
import { RawHeaders } from './decorators/raw-headers.decorator';
import { UserRoleGuard } from './guards/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { Auth } from './decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testPrivateRoute(
    // @Req() req: Request
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @RawHeaders() rawHeaders: string[],
    @Headers() header: ParameterDecorator,
  ) {
    // console.log(req.user);
    // console.log(user);
    // console.log(userEmail);
    // console.log(rawHeaders);
    console.log(header['authorization']);

    return {
      ok: true,
      message: 'hello world private',
    };
  }

  // @SetMetadata('roles', ['admin', 'super-user'])
  @Get('private2')
  @RoleProtected('user')
  @UseGuards(AuthGuard(), UserRoleGuard)
  testPrivateRouteTwo(@GetUser() user: User) {
    return { ok: true, user };
  }

  @Get('private3')
  @Auth('user')
  testPrivateRouteThree(@GetUser() user: User) {
    return { ok: true, user };
  }
}
