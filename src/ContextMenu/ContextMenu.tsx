import { MouseEvent, ReactElement, ReactNode, useEffect, useState } from 'react';
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
  const [children, setChildren] = useState<ReactNode>(<></>);
  const dispatch = useDispatch();

  const stopPropagationAndHide = (e: MouseEvent): void => {
    e.stopPropagation();
    dispatch(UiActions.hideContextMenu());
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
    }
  }, [data]);

  return data
    ? (
      <>
        <StyledDiv
          onClick={ stopPropagationAndHide }
          coords={ data.coords }
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