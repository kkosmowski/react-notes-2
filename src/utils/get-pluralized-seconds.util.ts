export const getPluralizedSecondsUtil = (amountOfSeconds: number): string => {
  if (amountOfSeconds === 1) {
    return 'SECOND';
  }
  if (
    amountOfSeconds%1 || amountOfSeconds < 5 || (amountOfSeconds%100 > 20 && amountOfSeconds%100 < 25)
  ) {
    return 'SECONDS2';
  }
  return 'SECONDS';
};
