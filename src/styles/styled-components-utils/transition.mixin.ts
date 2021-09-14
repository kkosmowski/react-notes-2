export const transition = (property: string, time: string, timingFn = 'ease-in-out'): string => `
  transition: ${ property } ${ time } ${ timingFn };
  will-change: ${ property };
`;