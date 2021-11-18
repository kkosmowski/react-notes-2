import { MouseEvent, ReactElement, useEffect, useState } from 'react';
import { Backdrop } from '../Backdrop/Backdrop';
import { SidebarButton } from './SidebarButton';
import { CategoriesList } from './CategoriesList';
import { SidebarWrapper } from './styles/Sidebar.styled';
import UiActions from '../store/actionCreators/ui.action-creators';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsMobile, selectSidebarOpened } from '../store/selectors/ui.selectors';
import { CreateNewFolder, Settings as SettingsIcon } from '@material-ui/icons';
import { Color } from '../domain/enums/color.enum';
import { useHistory } from 'react-router-dom';
import SettingsActions from '../store/actionCreators/settings.action-creators';

export const Sidebar = (): ReactElement => {
  const opened: boolean = useSelector(selectSidebarOpened);
  const isMobile: boolean = useSelector(selectIsMobile);
  const [className, setClassName] = useState<string>('');
  const [addCategory, setAddCategory] = useState<void[]>([]); // @todo temporary hack
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
    setAddCategory([...addCategory]);
  };

  const handleSidebarClose = (): void => {
    dispatch(UiActions.closeSidebar());
  };

  const handleSidebarClick = (): void => {
    dispatch(UiActions.openSidebar());
  };

  const handleSettingsClick = (e: MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();

    dispatch(SettingsActions.openSettings());

    history.push(
      { pathname: '/settings' },
      { previous: history.location.pathname }
      );
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

        <CategoriesList add={ addCategory } />

        <SidebarButton
          onClick={ handleSettingsClick }
          label="COMMON:SETTINGS"
        >
          <SettingsIcon />
        </SidebarButton>
      </SidebarWrapper>
      <Backdrop onClick={ handleSidebarClose } className="sidebar-backdrop" />
    </>
  );
};
