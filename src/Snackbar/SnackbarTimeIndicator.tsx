import { ReactElement, useEffect, useState } from 'react';
import styled from 'styled-components';
import { transition } from '../styles/styled-components-utils/transition.mixin';

interface Props {
  duration: number;
}

export const SnackbarTimeIndicator = ({ duration }: Props): ReactElement => {
  const [className, setClassName] = useState<string>('');

  useEffect(() => {
    setClassName('animate');
  }, [duration]);

  return <DurationBar duration={ duration } className={ className } />;
};

const DurationBar = styled.div<Props>`
  background-color: var(--primary);
  height: 3px;
  width: 100%;
  transform: scaleX(1);
  transform-origin: left;
  ${ ({ duration }) => transition('transform', duration + 'ms', null, 'linear') };

  &.animate {
    transform: scaleX(0);
  }
`;