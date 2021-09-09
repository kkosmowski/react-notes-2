import styled from 'styled-components';
import { CircularProgress } from '@material-ui/core';
import { ReactElement } from 'react';
import { getCenterStylesForLoader } from './get-center-styles-for-loader.util';
import { LoaderCentered } from '../domain/enums/loader-centered.enum';

interface Props {
  absolute?: boolean;
  centered?: LoaderCentered;
}

export const Loader = ({ absolute, centered }: Props): ReactElement => (
  <Wrapper absolute={ absolute } centered={ centered }>
    <StyledCircularProgress size={ 60 } variant="indeterminate" />
  </Wrapper>
);

const Wrapper = styled.div<Props>`
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