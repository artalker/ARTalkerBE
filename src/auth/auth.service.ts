import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { Profile } from 'passport-kakao';
import { User } from '../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';

interface KakaoTokenResponse {
  access_token: string;
  token_type: string;
  refresh_token?: string;
  expires_in: number;
}

interface KakaoUserResponse {
  id: number;
  properties: {
    nickname: string;
    thumbnail_image: string;
    profile_image: string;
  };
  kakao_account: {
    profile: {
      nickname: string;
    };
    profile_image_needs_agreement: boolean;
    is_default_image: boolean;
    is_default_nickname: boolean;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async validateKakaoUser(profile: Profile) {
    const { id, username, displayName } = profile;

    // 기존 사용자 확인
    let user = await this.usersService.findByKakaoId(id);

    if (!user) {
      // 새 사용자 생성
      user = await this.usersService.create({
        name: displayName || username || `카카오사용자_${id}`,
        kakaoId: id,
        username: username || displayName,
        displayName: displayName,
      });
    }

    return user;
  }

  login(user: User) {
    const payload = {
      sub: user.id,
      username: user.name,
      kakaoId: user.kakaoId,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user,
    };
  }

  async kakaoLoginWithCode(code: string) {
    try {
      // 1. 인가코드로 토큰 받기
      const tokenResponse = await this.getKakaoToken(code);

      // 2. 토큰으로 사용자 정보 받기
      const userInfo = await this.getKakaoUserInfo(tokenResponse.access_token);

      // 3. 사용자 정보로 회원가입/로그인 처리
      const user = await this.processKakaoUser(userInfo);

      // 4. JWT 토큰 생성
      const result = this.login(user);

      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '알 수 없는 오류';
      throw new Error(`카카오 로그인 실패: ${errorMessage}`);
    }
  }

  private async getKakaoToken(code: string): Promise<KakaoTokenResponse> {
    const tokenUrl = 'https://kauth.kakao.com/oauth/token';
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: this.configService.getOrThrow<string>('KAKAO_REST_API_KEY'),
      client_secret: this.configService.getOrThrow<string>(
        'KAKAO_CLIENT_SECRET',
      ),
      redirect_uri: this.configService.getOrThrow<string>('KAKAO_REDIRECT_URI'),
      code: code,
    });

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`토큰 요청 실패: ${response.status} ${errorText}`);
    }

    return (await response.json()) as KakaoTokenResponse;
  }

  private async getKakaoUserInfo(
    accessToken: string,
  ): Promise<KakaoUserResponse> {
    const userInfoUrl = 'https://kapi.kakao.com/v2/user/me';

    const response = await fetch(userInfoUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('사용자 정보 요청 실패');
    }

    return (await response.json()) as KakaoUserResponse;
  }

  private async processKakaoUser(kakaoUser: KakaoUserResponse) {
    const { id, properties } = kakaoUser;
    const { nickname, thumbnail_image, profile_image } = properties;

    const kakaoId = id.toString();

    // 기존 사용자 확인
    let user = await this.usersService.findByKakaoId(kakaoId);

    if (!user) {
      // 새 사용자 생성
      user = await this.usersService.create({
        name: nickname || `카카오사용자_${kakaoId}`,
        kakaoId: kakaoId,
        username: nickname,
        displayName: nickname,
        profileImageUrl: profile_image,
        thumbnailImageUrl: thumbnail_image,
      });
    }

    return user;
  }
}
