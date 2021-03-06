import styled from 'styled-components/macro';
import { textEllipsis } from '../styles/styled-components-utils/text-ellipsis.mixin';

export const MainWrapper = styled.main`
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
  background-color: var(--background250);
  padding: 16px 0;
  color: var(--foreground);
  margin-inline-start: var(--sidebar-width);
`;

export const CategoryTitle = styled.h1`
  display: inline-block;
  font-size: 36px;
  font-weight: inherit;
  margin: 0 var(--wrapper-horizontal-padding) 16px;
  min-height: 48px;
  
  &.--cut {
    ${ textEllipsis }
  }
`;