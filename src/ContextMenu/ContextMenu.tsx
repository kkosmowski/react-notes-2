import { MouseEvent, ReactElement, ReactNode, useEffect, useRef, useState } from 'react';
import styled from 'styled-components/macro';
import { useDispatch, useSelector } from 'react-redux';
import { Coords } from '../domain/interfaces/coords.interface';
import { selectContextMenuData } from '../store/selectors/ui.selectors';
import { ContextMenuData } from '../domain/interfaces/context-menu-data.interface';
import UiActions from '../store/actionCreators/ui.action-creators';
import { ContextMenuItem } from './ContextMenuItem';
import { ContextMenuItemInterface } from '../domain/interfaces/context-menu-item.interface';
import { useTranslation } from 'react-i18next';
import { contextMenuTestId } from '../domain/consts/test-ids.consts';
import { Backdrop } from '../Backdrop/Backdrop';
import { selectSelectedNotesCount } from '../store/selectors/note.selectors';

export const ContextMenu = (): ReactElement | null => {
  const { t } = useTranslation();
  const data: ContextMenuData | null = useSelector(selectContextMenuData);
  const selectedNotesCount = useSelector(selectSelectedNotesCount);
  const [menuCoords, setMenuCoords] = useState<Coords | undefined>(data?.coords);
  const [children, setChildren] = useState<ReactNode>(<></>);
  const dispatch = useDispatch();
  const ref = useRef<HTMLDivElement | null>(null);
  const menuMargin = 8;

  const stopPropagationAndHide = (e: MouseEvent): void => {
    e.stopPropagation();
    dispatch(UiActions.hideContextMenu());
  };

  const validateCoords = (coords: Coords): void => {
    const _coords = { ...coords };

    setTimeout(() => {
      if (ref.current) {
        const menuDOMRect = ref.current!.getBoundingClientRect();

        if (_coords.x + menuDOMRect.width + menuMargin > window.innerWidth) {
          _coords.x = window.innerWidth - menuDOMRect.width - menuMargin;
        }
        if (_coords.y + menuDOMRect.height + menuMargin > window.innerHeight) {
          _coords.y = window.innerHeight - menuDOMRect.height - menuMargin;
        }
      }

      setMenuCoords(_coords);
    });
  };

  useEffect(() => {
    if (data) {
      setChildren(data.items.map((item: ContextMenuItemInterface) => (
        <ContextMenuItem
          onClick={ item.callback }
          disabled={ !item.multi && selectedNotesCount > 1 }
          warn={ item.warn }
          testid={ item.testid }
          key={ item.label }
        >
          { t(item.label) }
        </ContextMenuItem>
      )));

      validateCoords(data.coords);
    } else {
      setMenuCoords(undefined);
    }
  }, [data]);

  return data
    ? (
      <>
        <StyledDiv
          onClick={ stopPropagationAndHide }
          coords={ menuCoords || data.coords }
          ref={ ref }
          data-testid={ contextMenuTestId }
        >
          { children }
        </StyledDiv>
        { data && <Backdrop onClick={ stopPropagationAndHide } zIndex={ 200 } /> }
      </>
    )
    : null;
};

const StyledDiv = styled.div<{ coords: Coords }>`
  position: absolute;
  z-index: 201;
  ${ ({ coords }) => `left: ${ coords.x }px; top: ${ coords.y }px;` }
  display: flex;
  flex-direction: column;
  background-color: var(--background50);
`;