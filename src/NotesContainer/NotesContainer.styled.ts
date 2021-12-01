import styled from 'styled-components/macro';
import { Masonry } from '@mui/lab';
import { ResponsiveStyleValue } from '@mui/system';
import { COLUMN_MAX_WIDTH_PX } from '../domain/consts/note-container.consts';

export const NotesWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

export const NotesWrapperContainer = styled.section`
  position: relative;
  padding: var(--wrapper-horizontal-padding);
`;

export const NoNotesText = styled.p`
  color: var(--foreground-61);
`;

export const StyledMasonry = styled(Masonry)<{ columns?: ResponsiveStyleValue<number | string> }>`
  ${ ({ columns }) => {
    if (typeof columns === 'number') {
      if (columns * COLUMN_MAX_WIDTH_PX < window.innerWidth) {
        return `width: ${ columns * COLUMN_MAX_WIDTH_PX }px;`;
      }
    }
    return '';
  } }
`;