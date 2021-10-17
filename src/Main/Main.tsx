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
import { selectNoteSelectionMode, selectSelectedNotes } from '../store/selectors/note.selectors';
import { EntityUid } from '../domain/types/entity-uid.type';
import { SnackbarContainer } from '../Snackbar/SnackbarContainer';
import { Route, Switch } from 'react-router-dom';
import { CategoryTitle, MainWrapper } from './Main.styled';
import { rootCategory } from '../domain/consts/root-category.const';

const AppRoutes = (): ReactElement => (
  <Switch>
    <Route path="/category/:categoryId">
      <Route path="/add-note">
        <NoteDialog />
      </Route>

      <Route path="/note/:noteId">
        <NoteDialog />
      </Route>
      <ControlsBar />
      <NotesContainer />
    </Route>

    <Route path="/">
      <Route path="/add-note">
        <NoteDialog />
      </Route>

      <Route path="/note/:noteId">
        <NoteDialog />
      </Route>
      <ControlsBar />
      <NotesContainer />
    </Route>
  </Switch>
);

export const Main = (): ReactElement => {
  const currentCategoryId: EntityUid = useSelector(selectCurrentCategoryId);
  const categories: Category[] = useSelector(selectCategories);
  const [activeCategory, setActiveCategory] = useState<Category>(rootCategory);
  const selectedNotes: Record<EntityUid, boolean> = useSelector(selectSelectedNotes);
  const selectionMode: NoteSelectionMode = useSelector(selectNoteSelectionMode);
  const dispatch = useDispatch();

  useEffect(() => {
    setActiveCategory(categories.find((category) => category.id === currentCategoryId)!);
  }, [currentCategoryId, categories]);

  const handleOnWrapperClick = (e: MouseEvent): void => {
    e.stopPropagation();
    if (selectionMode === NoteSelectionMode.Single && Object.values(selectedNotes).length) {
      dispatch(NoteActions.clearSelection());
    }
  };

  const handleOnWrapperDoubleClick = (e: MouseEvent): void => {
    e.stopPropagation();
    if (selectionMode === NoteSelectionMode.Multi && Object.values(selectedNotes).length) {
      dispatch(NoteActions.clearSelection());
    }
  };

  return (
    <MainWrapper
      onClick={ handleOnWrapperClick }
      onDoubleClick={ handleOnWrapperDoubleClick }
    >
      <CategoryTitle>{ activeCategory?.name || rootCategory.name }</CategoryTitle>
      <AppRoutes />

      <ConfirmationDialog />
      <SnackbarContainer />
    </MainWrapper>
  );
};
