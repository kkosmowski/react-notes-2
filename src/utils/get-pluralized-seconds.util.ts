export const getPluralizedSecondsUtil = (amountOfSeconds: number): string => {
  if (amountOfSeconds === 1) {
    return 'SETTINGS.SECOND';
  }
  if (
    amountOfSeconds%1 || amountOfSeconds < 5 || (amountOfSeconds%100 > 20 && amountOfSeconds%100 < 25)
  ) {
    return 'SETTINGS.SECONDS2';
  }
  return 'SETTINGS.SECONDS';
};
