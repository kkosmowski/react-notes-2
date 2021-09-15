import { ReactElement, useEffect, useState } from 'react';
import { NoteInterface } from '../domain/interfaces/note.interface';
import { MAX_CONTENT_LENGTH, MAX_TITLE_LENGTH } from '../domain/consts/note.consts';
import { EntityUid } from '../domain/types/entity-uid.type';
import { NoteSelectionProps } from '../domain/interfaces/note-selection-props.interface';
import { NoteContent, NoteElement, NoteTitle } from './Note.styles';

interface Props extends NoteSelectionProps {
  data: NoteInterface;
  onSelect: (id: EntityUid) => void;
  onOpen: (note: NoteInterface) => void;
}

export const Note = ({ data, isSelected, selectionMode, onSelect, onOpen }: Props): ReactElement => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    setTitle(trimIfNeeded(data.title, MAX_TITLE_LENGTH));
    setContent(trimIfNeeded(data.content, MAX_CONTENT_LENGTH));
  }, [data]);

  const trimIfNeeded = (string: string, maxLength: number): string => (
    string.length > maxLength ? string.slice(0, maxLength) + '...' : string
  );

  const handleSelect = (): void => {
    onSelect(data.id);
  };

  const handleOpen = (): void => {
    onOpen(data);
  };

  return (
    <NoteElement
      onClick={ handleSelect }
      onDoubleClick={ handleOpen }
      isSelected={ isSelected }
      selectionMode={ selectionMode }
    >
      <NoteTitle>{ title }</NoteTitle>
      <NoteContent>{ content }</NoteContent>
    </NoteElement>
  );
};