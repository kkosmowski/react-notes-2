import { MouseEvent, ReactElement, useEffect, useState } from 'react';
import { ControlsBar } from './ControlsBar/ControlsBar';
import { NoteDialog } from '../NoteDialog/NoteDialog';
import { ConfirmationDialog } from '../ConfirmationDialog/ConfirmationDialog';
import { NotesContainer } from '../NotesContainer/NotesContainer';
import { useDispatch, useSelector } from 'react-redux';
import { selectCategories, selectCurrentCategoryId } from '../store/selectors/category.selectors';
import { Category } from '../domain/interfaces/category.interface';
import NoteActions from '../store/actionCreators/note.action-creators';
import { NoteSelectionMode } from '../domain/enums/note-selection-mode.enum';
import { selectNoteSelectionMode, selectSelectedNotesCount } from '../store/selectors/note.selectors';
import { SnackbarContainer } from '../Snackbar/SnackbarContainer';
import { Route, Switch, useHistory } from 'react-router-dom';
import { CategoryTitle, MainWrapper } from './Main.styled';
import { rootCategory } from '../domain/consts/root-category.const';
import { categoryTitleTestId } from '../domain/consts/test-ids.consts';
import { Settings } from '../Settings/Settings';
import { selectSettingsOpened } from '../store/selectors/settings.selectors';
import { useTranslation } from 'react-i18next';
import { ShortcutsDialog } from '../ShortcutsDialog/ShortcutsDialog';
import {
  selectColorDialogOpened,
  selectAddToCategoryDialogOpened
} from '../store/selectors/ui.selectors';
import { ColorDialog } from '../ColorDialog/ColorDialog';
import { AddToCategoryDialog } from '../AddToCategoryDialog/AddToCategoryDialog';
import { RouterUtil } from '../domain/utils/router.util';

const AppRoutes = (): ReactElement => {
  const app: ReactElement = (
    <>
      <ControlsBar />
      <NotesContainer />

      <Route path="*/add-note">
        <NoteDialog />
      </Route>

      <Route path="*/note/:noteId">
        <NoteDialog />
      </Route>

      <Route path="/shortcuts">
        <ShortcutsDialog />
      </Route>
    </>
  );

  return (
    <Switch>
      <Route path="/category/:categoryId">
        { app }
      </Route>

      <Route path="/settings">
        <Settings />
      </Route>

      <Route path="/">
        { app }
      </Route>
    </Switch>
  );
};

export const Main = (): ReactElement => {
  const currentCategoryId = useSelector(selectCurrentCategoryId);
  const categories: Category[] = useSelector(selectCategories);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [titleIsCut, setTitleIsCut] = useState(true);
  const selectedNotesCount = useSelector(selectSelectedNotesCount);
  const selectionMode: NoteSelectionMode = useSelector(selectNoteSelectionMode);
  const settingsOpened: boolean = useSelector(selectSettingsOpened);
  const colorDialogOpened = useSelector(selectColorDialogOpened);
  const moveToCategoryDialogOpened = useSelector(selectAddToCategoryDialogOpened);
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();

  useEffect(() => {
    if (categories.length) {
      const currentCategory: Category | undefined = categories
        .find((category) => category.id === currentCategoryId);

      if (currentCategory) {
        setActiveCategory(categories.find((category) => category.id === currentCategoryId)!);
      } else if (history.location.pathname.includes('category')) {
        setActiveCategory(null);
        RouterUtil.push('/', history);
      }
    }
  }, [currentCategoryId, categories]);

  const handleOnWrapperClick = (e: MouseEvent): void => {
    e.stopPropagation();
    if (selectionMode === NoteSelectionMode.Single && selectedNotesCount) {
      dispatch(NoteActions.clearSelection());
    }
  };

  const handleOnWrapperDoubleClick = (e: MouseEvent): void => {
    e.stopPropagation();
    if (selectionMode === NoteSelectionMode.Multi) {
      dispatch(NoteActions.clearSelection());
      dispatch(NoteActions.toggleSelectionMode());
    }
  };

  const handleTitleClick = (): void => {
    setTitleIsCut(!titleIsCut);
  };

  return (
    <MainWrapper
      onClick={ handleOnWrapperClick }
      onDoubleClick={ handleOnWrapperDoubleClick }
    >
      <CategoryTitle
        onClick={ handleTitleClick }
        data-testid={ categoryTitleTestId }
        className={ titleIsCut ? '--cut' : '' }
      >
        { settingsOpened
          ? t('COMMON.SETTINGS')
          : activeCategory?.name || t(rootCategory.name)
        }
      </CategoryTitle>
      <AppRoutes />

      <ConfirmationDialog />
      { colorDialogOpened && <ColorDialog /> }
      { moveToCategoryDialogOpened && <AddToCategoryDialog /> }
      <SnackbarContainer />
    </MainWrapper>
  );
};
