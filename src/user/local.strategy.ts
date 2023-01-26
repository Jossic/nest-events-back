import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super();
  }

  public async validate(username: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      this.logger.debug(`User ${username} not found`);
      throw new UnauthorizedException();
    }

    if (password !== user.password) {
      this.logger.debug(`Invalid credential for ${username}`);
      throw new UnauthorizedException();
    }

    return user;
  }
}