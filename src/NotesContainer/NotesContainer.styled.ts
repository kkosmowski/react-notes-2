import styled from 'styled-components/macro';

export const NotesWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

export const NotesWrapperContainer= styled.section<{ columns: number }>`
  position: relative;
  display: grid; // @todo to optional refactor into custom masonry
  grid-template-columns: repeat(${ ({ columns }) => columns }, 1fr);
  grid-gap: 16px;
  padding: var(--wrapper-horizontal-padding);
  
  @media (min-width: 600px) {
    grid-gap: 8px;
  }
`;

export const NoNotesText = styled.p`
  color: var(--white-61);
`;