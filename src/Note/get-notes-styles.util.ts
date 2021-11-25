import { css, FlattenSimpleInterpolation } from 'styled-components/macro';

export const noteBackgroundColor = 'var(--background200)';

export const getNoteStyles = (isArchived?: boolean): FlattenSimpleInterpolation => {
  return isArchived
    ? css`
      background-color: var(--background300);
      color: var(--foreground-77);
      
      > p {
        color: var(--foreground-43);
      }
    `
    : css`
      background-color: ${ noteBackgroundColor };
    `;
};
