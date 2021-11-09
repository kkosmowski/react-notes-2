import { ReactElement, useEffect, useState } from 'react';
import { Backdrop } from '../Backdrop/Backdrop';
import { AddCategoryButton } from './AddCategoryButton';
import { CategoriesList } from './CategoriesList';
import { SidebarWrapper } from './styles/Sidebar.styled';
import UiActions from '../store/actionCreators/ui.action-creators';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsMobile, selectSidebarOpened } from '../store/selectors/ui.selectors';

export const Sidebar = (): ReactElement => {
  const opened: boolean = useSelector(selectSidebarOpened);
  const isMobile: boolean = useSelector(selectIsMobile);
  const [className, setClassName] = useState<string>('');
  const [addCategory, setAddCategory] = useState<void[]>([]); // @todo temporary hack
  const dispatch = useDispatch();

  useEffect(() => {
    const classNameArray: string[] = [];

    if (opened) {
      classNameArray.push('--opened');
    }
    if (!isMobile) {
      classNameArray.push('--hoverable');
    }

    setClassName(classNameArray.join(' '));
  }, [opened, isMobile]);

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
      <SidebarWrapper
        onClick={ handleSidebarClick }
        className={ className }
      >
        <AddCategoryButton onClick={ handleCategoryAdd } />
        <CategoriesList add={ addCategory } />
      </SidebarWrapper>
      <Backdrop onClick={ handleSidebarClose } className="sidebar-backdrop" />
    </>
  );
};
