import { css, FlattenSimpleInterpolation } from 'styled-components/macro';

export const getNoteStyles = (isArchived?: boolean): FlattenSimpleInterpolation => {
  return isArchived
    ? css`
      background-color: var(--background250);
      color: var(--foreground-77);
      
      > p {
        color: var(--foreground-43);
      }
    `
    : css`
      background-color: var(--background200);
    `;
};
