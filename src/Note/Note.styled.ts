import styled, { css } from 'styled-components/macro';
import { NoteSelectionProps } from '../domain/interfaces/note-selection-props.interface';
import { transition } from '../styles/styled-components-utils/transition.mixin';
import { getNoteSelectionStyles } from './get-note-selection-styles.util';
import { getNoteStyles } from './get-notes-styles.util';
import { NoteColorOverlay } from '../ColorPicker/styles/ColorPicker.styled';

export const NoteElement = styled.article<NoteSelectionProps & { color?: string }>`
  display: flex;
  flex-direction: column;
  min-width: 200px;
  min-height: 60px;
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
  --line-height: 22px;
  letter-spacing: 0.4px;
  word-break: break-word;
  max-height: calc(2 * var(--line-height));
  overflow: hidden;
`;

export const NoteContent = styled.p`
  --line-height: 19px;
  color: var(--foreground-61);
  word-break: break-word;
  max-height: calc(5 * var(--line-height));
  white-space: pre-wrap;
  overflow: hidden;
`;