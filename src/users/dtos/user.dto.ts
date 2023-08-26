
export class UserDto {
  name: string;
  username: string;
  email: string;
  password: string; //TODO ADD BCRYPT -> Passport!
  birthday: Date;
}