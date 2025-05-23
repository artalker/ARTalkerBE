import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-kakao';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    const clientID = configService.getOrThrow<string>('KAKAO_REST_API_KEY');
    const clientSecret = configService.getOrThrow<string>(
      'KAKAO_CLIENT_SECRET',
    );
    const callbackURL = configService.getOrThrow<string>('KAKAO_REDIRECT_URI');

    super({
      clientID,
      clientSecret,
      callbackURL,
    });
  }

  validate(accessToken: string, refreshToken: string, profile: Profile) {
    console.log('validate', accessToken, refreshToken, profile);
    // const { _raw, _json, ...profileRest } = profile;
    // const properties = _.mapKeys(_json.properties, (v, k) => {
    //   return _.camelCase(k);
    // });
    // const payload = {
    //   profile: profileRest,
    //   properties,
    //   token: {
    //     accessToken,
    //     refreshToken,
    //   },
    console.log('accessToken', accessToken);
    console.log('refreshToken', refreshToken);
    console.log('profile', JSON.stringify(profile));

    return {
      accessToken,
      refreshToken,
      profile,
    };
  }
  // done(null, payload);
}
