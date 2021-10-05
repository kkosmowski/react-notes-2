import { ReactElement, useState } from 'react';
import { Backdrop } from '../Backdrop/Backdrop';
import { AddCategoryButton } from './AddCategoryButton';
import { CategoriesList } from './CategoriesList';
import { SidebarWrapper } from './styles/Sidebar.styled';
import UiActions from '../store/actionCreators/ui.action-creators';
import { useDispatch, useSelector } from 'react-redux';
import { selectSidebarOpened } from '../store/selectors/ui.selectors';

export const Sidebar = (): ReactElement => {
  const opened: boolean = useSelector(selectSidebarOpened);
  const [addCategory, setAddCategory] = useState<void[]>([]); // @todo temporary hack
  const dispatch = useDispatch();

  const handleCategoryAdd = (): void => {
    setAddCategory([...addCategory]);
  };

  const handleSidebarClose = (): void => {
    dispatch(UiActions.closeSidebar());
  };

  const handleSidebarClick = (): void => {
    dispatch(UiActions.openSidebar());
  };

  return (
    <>
      <SidebarWrapper onClick={ handleSidebarClick } className={ opened ? '--opened' : '' }>
        <AddCategoryButton onClick={ handleCategoryAdd } />
        <CategoriesList add={ addCategory } />
      </SidebarWrapper>
      <Backdrop onClick={ handleSidebarClose } className="sidebar-backdrop" />
    </>
  );
};
