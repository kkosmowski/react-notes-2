import styled from 'styled-components/macro';
import { Switch, withStyles } from '@material-ui/core';

export const Bar = styled.div`
  background-color: var(--background200);

  &,
  > * {
    display: flex;
    align-items: center;
  }
`;

export const LeftContainer = styled.div`
  flex: 1;
  padding: 8px var(--wrapper-horizontal-padding) 0;

  > .button {
    margin-bottom: 8px;
    
    &:not(:last-child) {
      margin-inline-end: 8px;
    }
  }
  
  @media (max-width: 350px) {
    padding-top: 6px;

    > .button {
      margin-bottom: 6px;

      &:not(:last-child) {
        margin-inline-end: 6px;
      }
    }
  }
`;

export const ArchivedSwitch = withStyles({
  switchBase: {
    color: 'var(--primary200)',
    '&$checked': {
      color: 'var(--primary100)',
    },
    '&$checked + $track': {
      backgroundColor: 'var(--primary)',
    },
  },
  checked: {},
  track: {},
})(Switch);

export const RightContainer = styled.div`
  font-size: 13.3333px;
  
  @media (max-width: 350px) {
    svg {
      font-size: 20px;
    }
  }
`;