import { ReactElement } from 'react';
import { NoteInterface } from '../domain/interfaces/note.interface';
import styled from 'styled-components';

interface Props {
  data: NoteInterface;
}

export const Note = ({ data }: Props): ReactElement => {
  return (
    <NoteElement>
      <NoteTitle>{ data.title }</NoteTitle>
      <NoteContent>{ data.content }</NoteContent>
    </NoteElement>
  );
};

const NoteElement = styled.article`
  display: flex;
  flex-direction: column;
  padding: 8px 12px;
  background-color: var(--dark200);
  cursor: pointer;
`;

const NoteTitle = styled.h3`
  letter-spacing: 0.4px;
`;

const NoteContent = styled.p`
  color: var(--white-60);
`;