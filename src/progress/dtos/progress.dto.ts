import { ActivityLevelEnum, GoalEnum } from '../progress.enums';

export class ProgressDto {
  height: number;
  weight: number;
  activity_level: ActivityLevelEnum;
  goal: GoalEnum;
}