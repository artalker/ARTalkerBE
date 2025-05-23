import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { KakaoAuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('kakao')
  @UseGuards(KakaoAuthGuard)
  async kakaoAuth() {}

  @Get('kakao/callback')
  @UseGuards(KakaoAuthGuard)
  async kakoCallback(
    // @SocialUser() user: SocialUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    // const { accessToken, refreshToken } = await this.authService.login(user);
    // res.cookie('accessToken', accessToken);
    // res.cookie('refreshToken', refreshToken);
    // res.redirect('http://localhost:3000/');
  }
}
