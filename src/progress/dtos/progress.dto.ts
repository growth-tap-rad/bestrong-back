import { ActivityLevelEnum, GoalWheightEnum } from '../constants/progress.enums';

export class ProgressDto {
  height: number;
  weight: number;
  activity_level: ActivityLevelEnum;
  goal: GoalWheightEnum;
}