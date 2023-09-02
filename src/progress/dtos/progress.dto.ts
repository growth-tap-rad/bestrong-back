import { ActivityLevelEnum, GoalWheightEnum } from '../constants/progress.enums';

export interface ProgressDto {
  height: number;
  weight: number;
  activity_level: ActivityLevelEnum;
  goal: GoalWheightEnum;
}