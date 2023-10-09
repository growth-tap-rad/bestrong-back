export class AuthDto {
  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }
  accessToken: string;
}