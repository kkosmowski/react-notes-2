import { MouseEvent, ReactElement, useEffect, useState } from 'react';
import { Backdrop } from '../Backdrop/Backdrop';
import { SidebarButton } from './SidebarButton';
import { CategoriesList } from './CategoriesList';
import { SidebarWrapper } from './styles/Sidebar.styled';
import UiActions from '../store/actionCreators/ui.action-creators';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsMobile, selectSidebarOpened } from '../store/selectors/ui.selectors';
import { CreateNewFolder, Keyboard, Settings as SettingsIcon } from '@material-ui/icons';
import { Color } from '../domain/enums/color.enum';
import { useHistory } from 'react-router-dom';
import CategoryActions from '../store/actionCreators/category.action-creators';
import { RouterUtil } from '../domain/utils/router.util';

export const Sidebar = (): ReactElement => {
  const opened: boolean = useSelector(selectSidebarOpened);
  const isMobile: boolean = useSelector(selectIsMobile);
  const [className, setClassName] = useState<string>('');
  const [animated, setAnimated] = useState<boolean>(false);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    setTimeout(() => {
      setAnimated(true);
    });
  }, []);

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
    dispatch(CategoryActions.addCategory());
  };

  const handleSidebarClose = (): void => {
    dispatch(UiActions.closeSidebar());
  };

  const handleSidebarClick = (): void => {
    dispatch(UiActions.openSidebar());
  };

  const handleSettingsClick = (e: MouseEvent): void => {
    e.stopPropagation();
    RouterUtil.push('/settings', history, { dontCompareWithPrevious: true });
  };

  const handleShortcutsClick = (e: MouseEvent): void => {
    e.stopPropagation();
    RouterUtil.push('/shortcuts', history, { dontCompareWithPrevious: true });
  };

  return (
    <>
      <SidebarWrapper
        onClick={ handleSidebarClick }
        className={ className }
        animated={ animated }
      >
        <SidebarButton
          onClick={ handleCategoryAdd }
          color={ Color.Primary }
          label="ADD_CATEGORY"
        >
          <CreateNewFolder />
        </SidebarButton>

        <CategoriesList />

        <SidebarButton
          onClick={ handleSettingsClick }
          label="COMMON:SETTINGS"
        >
          <SettingsIcon />
        </SidebarButton>

        <SidebarButton
          onClick={ handleShortcutsClick }
          label="COMMON:SHORTCUTS"
        >
          <Keyboard />
        </SidebarButton>
      </SidebarWrapper>
      <Backdrop onClick={ handleSidebarClose } className="sidebar-backdrop" />
    </>
  );
};
