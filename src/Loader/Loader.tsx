import styled from 'styled-components/macro';
import { CircularProgress } from '@material-ui/core';
import { ReactElement, useEffect, useRef } from 'react';
import { getCenterStylesForLoader } from './get-center-styles-for-loader.util';
import { LoaderCentered } from '../domain/enums/loader-centered.enum';
import { LoaderSize } from '../domain/enums/loader-size.enum';
import { getSizeForLoader } from './get-size-for-loader.util';

interface Props extends WrapperProps {
  size: LoaderSize;
}

interface WrapperProps {
  absolute?: boolean;
  centered?: LoaderCentered;
}

export const Loader = ({ absolute, centered, size }: Props): ReactElement => {
  const loaderSize = useRef<number>(0);

  useEffect(() => {
    loaderSize.current = getSizeForLoader(size);
  }, [size]);

  return (
    <Wrapper absolute={ absolute } centered={ centered }>
      <StyledCircularProgress size={ loaderSize.current } variant="indeterminate" />
    </Wrapper>
  );
};

const Wrapper = styled.div<WrapperProps>`
  ${ ({ absolute }) => absolute ? 'position: absolute;' : '' }
  ${ ({ centered }) => centered ? getCenterStylesForLoader(centered) : '' }
  padding: 16px;
  overflow: hidden;
`;

const StyledCircularProgress = styled(CircularProgress)`
  && {
    color: var(--primary);
  }
`;