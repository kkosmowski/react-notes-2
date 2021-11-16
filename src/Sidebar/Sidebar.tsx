import { ReactElement, useEffect, useState } from 'react';
import { Backdrop } from '../Backdrop/Backdrop';
import { SidebarButton } from './SidebarButton';
import { CategoriesList } from './CategoriesList';
import { SidebarWrapper } from './styles/Sidebar.styled';
import UiActions from '../store/actionCreators/ui.action-creators';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsMobile, selectSidebarOpened } from '../store/selectors/ui.selectors';
import { Button } from '../Button/Button';
import { Variant } from '../domain/enums/variant.enum';
import { CreateNewFolder, Settings as SettingsIcon } from '@material-ui/icons';
import { Color } from '../domain/enums/color.enum';

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

  const handleSettingsClick = (): void => {
    //
  }

  return (
    <>
      <SidebarWrapper
        onClick={ handleSidebarClick }
        className={ className }
      >
        <SidebarButton
          onClick={ handleCategoryAdd }
          color={ Color.Primary }
          label="ADD_CATEGORY"
        >
          <CreateNewFolder />
        </SidebarButton>

        <CategoriesList add={ addCategory } />

        <SidebarButton
          onClick={ handleSettingsClick }
          label="SETTINGS"
        >
          <SettingsIcon />
        </SidebarButton>
      </SidebarWrapper>
      <Backdrop onClick={ handleSidebarClose } className="sidebar-backdrop" />
    </>
  );
};
