export const concatTwoArraysUtil = <T>(arr1: T[], arr2: T[]): T[] => {
  return arr1.concat(arr2.filter((item) => !arr1.includes(item)));
};
