import { MouseEvent, ReactElement, useEffect, useState } from 'react';
import { NoteInterface } from '../domain/interfaces/note.interface';
import { MAX_CONTENT_LENGTH, MAX_TITLE_LENGTH } from '../domain/consts/note.consts';
import { EntityUid } from '../domain/types/entity-uid.type';
import { NoteSelectionProps } from '../domain/interfaces/note-selection-props.interface';
import { NoteContent, NoteElement, NoteTitle } from './Note.styled';
import { NoteSelectionMode } from '../domain/enums/note-selection-mode.enum';
import {
  noteSelectableTestId,
  noteSelectedTestId,
  noteTestId
} from '../domain/consts/test-ids.consts';
import { Coords } from '../domain/interfaces/coords.interface';
import UiActions from '../store/actionCreators/ui.action-creators';
import { useDispatch } from 'react-redux';
import { handleEventAndReturnCoords } from '../ContextMenu/handle-event-and-return-coords.util';

interface Props extends NoteSelectionProps {
  data: NoteInterface;
  onSelect: (id: EntityUid) => void;
  onOpen: (note: NoteInterface) => void;
  onDelete: (note: NoteInterface) => void;
}

export const Note = ({ data, isSelected, selectionMode, onSelect, onOpen, onDelete }: Props): ReactElement => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const dispatch = useDispatch();

  useEffect(() => {
    setTitle(trimIfNeeded(data.title, MAX_TITLE_LENGTH));
    setContent(trimIfNeeded(data.content, MAX_CONTENT_LENGTH));
  }, [data]);

  const trimIfNeeded = (string: string, maxLength: number): string => (
    string.length > maxLength ? string.slice(0, maxLength) + '...' : string
  );

  const handleSelect = (e: MouseEvent): void => {
    e.stopPropagation();
    onSelect(data.id);
  };

  const handleOpen = (): void => {
    onOpen(data);
  };

  const handleOpenAndEdit = (): void => {
    // @todo: implement remote setting of edit mode in the note dialog
    onOpen(data);
  };

  const handleDelete = (): void => {
    onDelete(data);
  };

  const getTestId = (): string => {
    return isSelected
      ? noteSelectedTestId
      : selectionMode === NoteSelectionMode.Multi
        ? noteSelectableTestId
        : noteTestId;
  };

  const handleContextMenu = (e: MouseEvent): void => {
    const coords: Coords = handleEventAndReturnCoords(e);

    dispatch(UiActions.showContextMenu({
      coords,
      items: [
        {
          label: 'COMMON:OPEN',
          callback: handleOpen,
        },
        {
          label: 'COMMON:EDIT',
          callback: handleOpenAndEdit,
        },
        {
          label: 'COMMON:DELETE',
          callback: handleDelete,
          warn: true,
        },
      ]
    }));
  };

  return (
    <NoteElement
      onClick={ handleSelect }
      onDoubleClick={ handleOpen }
      onContextMenu={ handleContextMenu }
      isSelected={ isSelected }
      selectionMode={ selectionMode }
      data-testid={ getTestId() }
    >
      <NoteTitle>{ title }</NoteTitle>
      <NoteContent>{ content }</NoteContent>
    </NoteElement>
  );
};