import { MockStoreEnhanced } from 'redux-mock-store';
import { RootState } from '../store/interfaces/root-state.interface';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ProvidedApp } from '../App';
import store from '../store/store';
import NoteActions from '../store/actionCreators/note.action-creators';
import { getMockedNote } from '../utils/get-mocked-note.util';
import { AnyAction } from 'redux';
import { snackbarCloseButtonTestId, snackbarTestId } from '../domain/consts/test-ids.consts';
import { getMockedCategory } from '../utils/get-mocked-category.util';
import CategoryActions from '../store/actionCreators/category.action-creators';
import { mockStore } from '../utils/mock.store';
import { initialRootState } from '../utils/initial-root-state';
import { Provider } from 'react-redux';
import { SnackbarContainer } from './SnackbarContainer';
import { initialUiState } from '../store/reducers/ui.reducer';
import { SnackbarInstance } from '../domain/interfaces/snackbar-instance.interface';
import { getMockedSnackbarInstance } from '../utils/get-mocked-snackbar-instance.util';
import UiActions from '../store/actionCreators/ui.action-creators';

describe('Snackbar', () => {
  let mockedStore: MockStoreEnhanced<RootState>;

  it('dispatches action on Close button clicked', async () => {
    const snackbarInstance: SnackbarInstance = getMockedSnackbarInstance();
    mockedStore = mockStore({
      ...initialRootState,
      ui: {
        ...initialUiState,
        snackbarQueue: [snackbarInstance]
      }
    });

    render(
      <Provider store={ mockedStore }>
        <SnackbarContainer />
      </Provider>
    );

    fireEvent.click(screen.getByTestId(snackbarCloseButtonTestId));

    await waitFor(() => {
      const actions = mockedStore.getActions();
      expect(actions[0].type).toEqual('HIDE_SNACKBAR');
    });
  });

  describe('should be visible on', () => {
    beforeEach(async () => {
      await store.dispatch(UiActions.hideSnackbar());
    });

    const setupWithNote = () => ({
      note: getMockedNote(),
      ...render(<ProvidedApp />),
    });

    const setupWithCategory = () => ({
      category: getMockedCategory(),
      ...render(<ProvidedApp />),
    });

    it('note create, delete and restore actions', async () => {
      const { note, getAllByTestId } = setupWithNote();

      store.dispatch(NoteActions.create(note) as unknown as AnyAction);
      store.dispatch(NoteActions.deleteNote(note.id) as unknown as AnyAction);
      store.dispatch(NoteActions.restoreNote(note) as unknown as AnyAction);
      //@todo swap delete with archive, chain the snackbars by clicking UI as user does
      // instead of dispatching artificial actions. Also, create a separate test for delete

      await waitFor(() => {
        const expectedSnackbarsCount = ['created', 'deleted', 'restored'].length;
        expect(getAllByTestId(snackbarTestId)).toHaveLength(expectedSnackbarsCount);
      });
    });

    it('category create, delete and restore actions', async () => {
      const { category, getAllByTestId } = setupWithCategory();

      store.dispatch(CategoryActions.createFromTemporary(category) as unknown as AnyAction);
      store.dispatch(CategoryActions.deleteCategory(category) as unknown as AnyAction);
      store.dispatch(CategoryActions.restoreCategory(category) as unknown as AnyAction);
      //@todo same as note (comment above)

      await waitFor(() => {
        const expectedSnackbarsCount = ['created', 'deleted', 'restored'].length;
        expect(getAllByTestId(snackbarTestId)).toHaveLength(expectedSnackbarsCount);
      });
    });
  });
});