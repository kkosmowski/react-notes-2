import { LoaderCentered } from '../domain/enums/loader-centered.enum';

export const getCenterStylesForLoader = (centered: LoaderCentered): string => {
  const top50 = 'top: 50%;';
  const left50 = 'left: 50%;';
  let styles = 'transform: translate';

  switch (centered) {
    case LoaderCentered.Both:
      styles += `(-50%, -50%); ${ top50 } ${ left50 }`;
      break;
    case LoaderCentered.Horizontally:
      styles += `X(-50%); ${ left50 }`;
      break;
    case LoaderCentered.Vertically:
      styles += `Y(-50%); ${ top50 }`;
      break;
  }

  return styles;
};