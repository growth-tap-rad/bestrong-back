export const BMR_MAN = (
  wheight: number,
  cmHeight: number,
  age: number,
): number => {
  return 66 + 13.7 * wheight + 5 * cmHeight - 6.8 * age;
};

export const BMR_WOMAN = (
  wheight: number,
  cmHeight: number,
  age: number,
): number => {
  return 665 + 9.6 * wheight + 1.8 * cmHeight - 4.7 * age;
};

export const ACTIVITY_FACTOR = {
  low: 1.3,
  moderate: 1.55,
  intense: 1.72,
};

export const GOAL_FACTOR = {
  lose: -300,
  maintain: 0,
  gain: 400,
};

