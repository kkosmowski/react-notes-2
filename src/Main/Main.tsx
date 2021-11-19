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
import { EntityUid } from '../domain/types/entity-uid.type';
import { SnackbarContainer } from '../Snackbar/SnackbarContainer';
import { Route, Switch } from 'react-router-dom';
import { CategoryTitle, MainWrapper } from './Main.styled';
import { rootCategory } from '../domain/consts/root-category.const';
import { categoryTitleTestId } from '../domain/consts/test-ids.consts';
import { Settings } from '../Settings/Settings';
import { selectSettingsOpened } from '../store/selectors/settings.selectors';
import { useTranslation } from 'react-i18next';

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
  const currentCategoryId: EntityUid = useSelector(selectCurrentCategoryId);
  const categories: Category[] = useSelector(selectCategories);
  const [activeCategory, setActiveCategory] = useState<Category>(rootCategory);
  const selectedNotesCount = useSelector(selectSelectedNotesCount);
  const selectionMode: NoteSelectionMode = useSelector(selectNoteSelectionMode);
  const settingsOpened: boolean = useSelector(selectSettingsOpened);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    setActiveCategory(categories.find((category) => category.id === currentCategoryId)!);
  }, [currentCategoryId, categories]);

  const handleOnWrapperClick = (e: MouseEvent): void => {
    e.stopPropagation();
    if (selectionMode === NoteSelectionMode.Single && selectedNotesCount) {
      dispatch(NoteActions.clearSelection());
    }
  };

  const handleOnWrapperDoubleClick = (e: MouseEvent): void => {
    e.stopPropagation();
    if (selectionMode === NoteSelectionMode.Multi && selectedNotesCount) {
      dispatch(NoteActions.clearSelection());
      dispatch(NoteActions.toggleSelectionMode());
    }
  };

  return (
    <MainWrapper
      onClick={ handleOnWrapperClick }
      onDoubleClick={ handleOnWrapperDoubleClick }
    >
      <CategoryTitle data-testid={ categoryTitleTestId }>
        { settingsOpened
          ? t('COMMON:SETTINGS')
          : activeCategory?.name || t(rootCategory.name)
        }</CategoryTitle>
      <AppRoutes />

      <ConfirmationDialog />
      <SnackbarContainer />
    </MainWrapper>
  );
};
