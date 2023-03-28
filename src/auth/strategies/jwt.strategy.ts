import { UnauthorizedException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';

import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';

import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { id } = payload;
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new UnauthorizedException('Token not valid');
    if (!user.isActive)
      throw new UnauthorizedException('User is inactive, talk with an admin');
    return user;
  }
}
