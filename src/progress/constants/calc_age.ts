import * as moment from 'moment';

export const CALC_AGE = (birthday: Date): number => {
  const today = moment();
  const birthDate = moment(birthday);

  const age = today.diff(birthDate, 'years');

  return age;
};
