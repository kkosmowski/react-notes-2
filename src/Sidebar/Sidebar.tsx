import { MouseEvent, ReactElement, useEffect, useState } from 'react';
import { Backdrop } from '../Backdrop/Backdrop';
import { SidebarButton } from './SidebarButton';
import { CategoriesList } from './CategoriesList';
import { SidebarWrapper, VersionLink } from './styles/Sidebar.styled';
import UiActions from '../store/actionCreators/ui.action-creators';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsMobile, selectSidebarOpened } from '../store/selectors/ui.selectors';
import { CreateNewFolder, Keyboard, Settings as SettingsIcon } from '@mui/icons-material';
import { Color } from '../domain/enums/color.enum';
import { useHistory } from 'react-router-dom';
import CategoryActions from '../store/actionCreators/category.action-creators';
import { RouterUtil } from '../domain/utils/router.util';
import { selectSettingsOpened } from '../store/selectors/settings.selectors';
import { version } from '../App';

export const Sidebar = (): ReactElement => {
  const opened = useSelector(selectSidebarOpened);
  const isMobile = useSelector(selectIsMobile);
  const settingsOpened = useSelector(selectSettingsOpened);
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
    RouterUtil.push(
      '/shortcuts',
      history,
      {
        dontCompareWithPrevious: true,
        keepPrevious: settingsOpened,
      }
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
          label="SIDEBAR.ADD_CATEGORY"
        >
          <CreateNewFolder />
        </SidebarButton>

        <CategoriesList />

        <SidebarButton
          onClick={ handleSettingsClick }
          label="COMMON.SETTINGS"
          color={ settingsOpened ? Color.Primary : Color.None }
        >
          <SettingsIcon />
        </SidebarButton>

        { !isMobile && (
          <SidebarButton
            onClick={ handleShortcutsClick }
            label="COMMON.SHORTCUTS"
          >
            <Keyboard />
          </SidebarButton>
        ) }

        <VersionLink
          href="https://github.com/kkosmowski/react-notes-2/blob/master/changelog.md"
          target="_blank"
        >
          v { version }
        </VersionLink>
      </SidebarWrapper>
      <Backdrop onClick={ handleSidebarClose } className="sidebar-backdrop" />
    </>
  );
};
