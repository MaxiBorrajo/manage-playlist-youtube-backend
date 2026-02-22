import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../users/user.model';
import { UserModule } from '../users/user.module';
import { GoogleStrategy } from './strategies/google.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy],
})
export class AuthModule {}
