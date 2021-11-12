import { MouseEvent, ReactElement, ReactNode, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { Coords } from '../domain/interfaces/coords.interface';
import { selectContextMenuData } from '../store/selectors/ui.selectors';
import { ContextMenuData } from '../domain/interfaces/context-menu-data.interface';
import UiActions from '../store/actionCreators/ui.action-creators';
import { ContextMenuItem } from './ContextMenuItem';
import { ContextMenuItemInterface } from '../domain/interfaces/context-menu-item.interface';
import { useTranslation } from 'react-i18next';
import { contextMenuTestId } from '../domain/consts/test-ids.consts';

export const ContextMenu = (): ReactElement | null => {
  const { t } = useTranslation();
  const data: ContextMenuData | null = useSelector(selectContextMenuData);
  const [children, setChildren] = useState<ReactNode>(<></>);
  const dispatch = useDispatch();

  const handleBackdropClick = (e: MouseEvent): void => {
    e.stopPropagation();
    dispatch(UiActions.hideContextMenu());
  };

  useEffect(() => {
    if (data) {
      setChildren(data.items.map((item: ContextMenuItemInterface) => (
        <ContextMenuItem
          onClick={ item.callback }
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
      <Backdrop onClick={ handleBackdropClick }>
        <StyledDiv
          coords={ data.coords }
          data-testid={ contextMenuTestId }
        >
          { children }
        </StyledDiv>
      </Backdrop>
    )
    : null;
};

const Backdrop = styled.div`
  position: fixed;
  z-index: 400;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`;

const StyledDiv = styled.div<{ coords: Coords }>`
  position: absolute;
  ${ ({ coords }) => `left: ${ coords.x }px; top: ${ coords.y }px;` }
  display: flex;
  flex-direction: column;
  background-color: var(--dark250);
`;