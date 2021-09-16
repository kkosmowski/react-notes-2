import styled from 'styled-components';
import { NoteSelectionProps } from '../domain/interfaces/note-selection-props.interface';
import { transition } from '../styles/styled-components-utils/transition.mixin';
import { getNoteSelectionStyles } from './get-note-selection-styles.util';

export const NoteElement = styled.article<NoteSelectionProps>`
  display: flex;
  flex-direction: column;
  padding: 8px 12px;
  background-color: var(--dark200);
  cursor: pointer;
  ${ transition('box-shadow', '0.15s') }
  ${ (props) => getNoteSelectionStyles(props) }
`;

export const NoteTitle = styled.h3`
  letter-spacing: 0.4px;
  word-break: break-word;
  max-height: 44px;
  overflow: hidden;
`;

export const NoteContent = styled.p`
  color: var(--white-61);
  word-break: break-word;
  max-height: 57px;
  overflow: hidden;
`;