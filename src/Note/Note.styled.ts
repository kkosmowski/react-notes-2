import styled, { css } from 'styled-components/macro';
import { NoteSelectionProps } from '../domain/interfaces/note-selection-props.interface';
import { transition } from '../styles/styled-components-utils/transition.mixin';
import { getNoteSelectionStyles } from './get-note-selection-styles.util';
import { getNoteStyles } from './get-notes-styles.util';
import { NoteColorOverlay } from '../ColorPicker/ColorPicker.styled';

export const NoteElement = styled.article<NoteSelectionProps & { color?: string }>`
  display: flex;
  flex-direction: column;
  padding: 8px 12px;
  cursor: pointer;
  ${ ({ isArchived }) => getNoteStyles(isArchived) }
  ${ transition('box-shadow', '0.15s') }
  ${ (props) => getNoteSelectionStyles(props) }
  user-select: none;
  ${ NoteColorOverlay }
  ${ ({ isArchived }) => isArchived 
    ? css`
      &::before {
        opacity: var(--note-archived-color-opacity);
      }`
    : '' }
`;

export const NoteTitle = styled.h3`
  letter-spacing: 0.4px;
  word-break: break-word;
  max-height: 44px;
  overflow: hidden;
`;

export const NoteContent = styled.p`
  color: var(--foreground-61);
  word-break: break-word;
  max-height: 57px;
  overflow: hidden;
`;