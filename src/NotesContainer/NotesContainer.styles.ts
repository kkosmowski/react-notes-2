import styled from 'styled-components';

export const NotesWrapper = styled.section<{ columns: number }>`
  position: relative;
  display: grid; // @todo to optional refactor into custom masonry
  grid-template-columns: repeat(${ ({ columns }) => columns }, 1fr);
  grid-gap: 8px;
  padding: var(--wrapper-horizontal-padding);
`;

export const NoNotesText = styled.p`
  color: var(--white-60);
`;