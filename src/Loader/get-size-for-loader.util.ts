import { LoaderSize } from '../domain/enums/loader-size.enum';

export const getSizeForLoader = (size: LoaderSize ): number => {
  switch (size) {
    case LoaderSize.Small: return 32;
    case LoaderSize.Medium: return 60;
  }
};