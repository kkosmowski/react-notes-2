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
    margin-inline-end: 8px;
    margin-bottom: 8px;
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
`;