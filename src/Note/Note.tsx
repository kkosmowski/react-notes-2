import { ReactElement, useEffect, useState } from 'react';
import { NoteInterface } from '../domain/interfaces/note.interface';
import styled from 'styled-components';
import { MAX_CONTENT_LENGTH, MAX_TITLE_LENGTH } from '../domain/consts/note.consts';

interface Props {
  data: NoteInterface;
}

export const Note = ({ data }: Props): ReactElement => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    setTitle(trimIfNeeded(data.title, MAX_TITLE_LENGTH));
    setContent(trimIfNeeded(data.content, MAX_CONTENT_LENGTH));
  }, [data]);

  const trimIfNeeded = (string: string, maxLength: number): string => {
    return string.length > maxLength ? string.slice(0, maxLength) + '...' : string;
  };

  return (
    <NoteElement>
      <NoteTitle>{ title }</NoteTitle>
      <NoteContent>{ content }</NoteContent>
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
  word-break: break-word;
  max-height: 44px;
  overflow: hidden;
`;

const NoteContent = styled.p`
  color: var(--white-60);
  word-break: break-word;
  max-height: 57px;
  overflow: hidden;
`;