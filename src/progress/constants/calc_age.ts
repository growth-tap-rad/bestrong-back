export const CALC_AGE = (birthday: Date): number => {
  const today = new Date();
  const birthDate = new Date(birthday);
  birthDate.setUTCHours(0, 0, 0, 0);
  today.setUTCHours(0, 0, 0, 0);

  let age = today.getUTCFullYear() - birthDate.getUTCFullYear();
  const monthDiff = today.getUTCMonth() - birthDate.getUTCMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getUTCDate() < birthDate.getUTCDate())
  ) {
    age--;
  }

  return age;
};
