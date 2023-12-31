import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BasicStrategy } from '../helpers/strategies/auth-basic.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersRepository } from '../users/infrastructure/users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/domain/entities/user.entity';
import { HashManager } from '../managers/hashManager';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../helpers/strategies/jwt.strategy';
import { MailManager } from '../managers/mailManager';
import { UsersService } from '../users/application/users.service';
import { JwtAuthGuard } from '../helpers/guards/jwt-auth.guard';
import { ExtractUserFromToken } from '../helpers/guards/extractUserFromToken.guard';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwtSecret'),
        signOptions: {
          expiresIn: `${configService.get<string>('jwtExpirationTime')}`,
        },
      }),
    }),
  ],
  providers: [
    BasicStrategy,
    AuthService,
    UsersRepository,
    UsersService,
    HashManager,
    JwtStrategy,
    MailManager,
    JwtAuthGuard,
    ExtractUserFromToken,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
