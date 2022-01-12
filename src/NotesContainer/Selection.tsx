import styled from 'styled-components/macro';
import {
  CSSProperties,
  MouseEvent,
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import { SelectionCoords } from '../domain/interfaces/selection-coords.interface';
import { MIN_SELECTION_SIZE_PX } from '../domain/consts/note-container.consts';
import NoteActions from '../store/actionCreators/note.action-creators';
import { EntityUid } from '../domain/types/entity-uid.type';
import { RenderedNote } from '../domain/interfaces/rendered-note.interface';
import { MouseAction, MouseActionPayload } from '../domain/interfaces/mouse-action.interface';
import { useDispatch } from 'react-redux';
import { getXYCoords, updateSelection } from './selection.utils';

interface Props {
  renderedNotes: RenderedNote[];
  mouseAction: MouseActionPayload | null;
  onSelectionCoverageChange: (noteIds: EntityUid[]) => void;
  selectionCoveredNotes: EntityUid[];
}

const initialSelection: SelectionCoords = { left: -999, top: 0, width: 0, height: 0, startX: 0, startY: 0 };

export const Selection = (
  { renderedNotes, mouseAction, selectionCoveredNotes, onSelectionCoverageChange }: Props
): ReactElement => {
  const [style, setStyle] = useState<CSSProperties>({});
  const [selection, setSelection] = useState<SelectionCoords>(initialSelection);
  const isMouseDown = useRef<boolean>(false);
  const selectionThreshold = 0.5;
  const dispatch = useDispatch();

  const isSelectionSizeAcceptable = useCallback(() =>
    selection.width > MIN_SELECTION_SIZE_PX && selection.height > MIN_SELECTION_SIZE_PX,
  [selection]);

  const isSelectionHidden = useCallback(() => selection.left === -999, [selection]);

  useEffect(() => {
    const isAcceptable = isSelectionSizeAcceptable();

    if (isSelectionHidden() || isAcceptable) {
      setStyle({
        left: selection.left + 'px',
        top: selection.top + 'px',
        width: selection.width + 'px',
        height: selection.height + 'px',
      });
    }

    if (isAcceptable) {
      checkIfContainsNotes();
    }
  }, [selection, setStyle]);

  useEffect(() => {
    if (mouseAction) {
      switch (mouseAction.action) {
        case MouseAction.Up:
          handleMouseUp(mouseAction.event);
          break;
        case MouseAction.Move:
          handleMouseMove(mouseAction.event);
          break;
        case MouseAction.Down:
          handleMouseDown(mouseAction.event);
          break;
      }
    }
  }, [mouseAction]);

  const checkIfContainsNotes = () => {
    const [selectionStart, selectionEnd] = getXYCoords(selection);

    onSelectionCoverageChange(renderedNotes
      .filter((note) => {
        const [noteStart, noteEnd] = getXYCoords(note);
        const selectionEndsBeforeNote = selectionEnd.x <= noteStart.x || selectionEnd.y <= noteStart.y;
        const selectionStartsAfterNote = selectionStart.x >= noteEnd.x || selectionStart.y >= noteEnd.y;

        if (selectionEndsBeforeNote || selectionStartsAfterNote) {
          return false;
        }

        const [, intersectionX1, intersectionX2] = [selectionStart.x, selectionEnd.x, noteStart.x, noteEnd.x].sort((a,b) => a > b ? 1 : -1);
        const [, intersectionY1, intersectionY2] = [selectionStart.y, selectionEnd.y, noteStart.y, noteEnd.y].sort((a,b) => a > b ? 1 : -1);

        const noteArea = note.width * note.height;
        const intersectedArea = (intersectionX2 - intersectionX1) * (intersectionY2 - intersectionY1);
        return intersectedArea / noteArea > selectionThreshold;
      })
      .map(note => note.id)
    );
  };

  const handleMouseDown = (e: MouseEvent): void => {
    e.stopPropagation();
    isMouseDown.current = true;

    setSelection({
      startX: e.clientX,
      startY: e.clientY,
      left: e.clientX,
      top: e.clientY,
      width: 0,
      height: 0,
    });
  };

  const handleMouseMove = (e: MouseEvent): void => {
    if (isMouseDown.current) {
      setSelection(updateSelection(selection, e));
    }
  };

  const handleMouseUp = (e: MouseEvent): void => {
    e.stopPropagation();
    isMouseDown.current = false;

    if (selectionCoveredNotes.length) {
      dispatch(NoteActions.selectMultipleNotes(selectionCoveredNotes));
    }

    onSelectionCoverageChange([]);
    setSelection(initialSelection);
  };

  return <SelectionDiv style={ style } />;
};

const SelectionDiv = styled.div`
  position: absolute;
  z-index: 1;
  background: var(--primary200-60);
  border: 1px solid var(--primary100);
  opacity: 0.3;
`;