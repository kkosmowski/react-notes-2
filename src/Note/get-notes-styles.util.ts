import { css, FlattenSimpleInterpolation } from 'styled-components/macro';

export const getNoteStyles = (isArchived?: boolean): FlattenSimpleInterpolation => {
  return isArchived
    ? css`
      background-color: var(--dark250);
      color: var(--white-77);
      
      > p {
        color: var(--white-43);
      }
    `
    : css`
      background-color: var(--dark200);
    `;
};
