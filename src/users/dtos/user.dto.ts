
export class UserDto {
  name: string;
  username: string;
  email: string;
  password: string; //TODO ADD BCRYPT
  birthday: Date;
  height: number;
  weight: number;
  activity_level: 'sedentary' | 'intermediate' | 'advanced';
  goal: 'lose_weight' | 'gain_muscle' | 'maintain';
}