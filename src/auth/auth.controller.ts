import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { KakaoLoginDto } from './dto/kakao-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('kakao/login')
  async kakaoLogin(@Body() body: KakaoLoginDto) {
    // 프론트엔드에서 받은 인가코드로 토큰 요청
    const result = await this.authService.kakaoLoginWithCode(body.code);
    return result;
  }
}
