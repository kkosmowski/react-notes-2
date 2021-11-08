import { MockStoreEnhanced } from 'redux-mock-store';
import { RootState } from '../store/interfaces/root-state.interface';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ProvidedApp } from '../App';
import store from '../store/store';
import NoteActions from '../store/actionCreators/note.action-creators';
import { getMockedNote } from '../utils/get-mocked-note.util';
import { NoteInterface } from '../domain/interfaces/note.interface';
import { AnyAction } from 'redux';
import { snackbarCloseButtonTestId, snackbarTestId } from '../domain/consts/test-ids.consts';
import { Category } from '../domain/interfaces/category.interface';
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

    fireEvent(
      screen.getByTestId(snackbarCloseButtonTestId),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      })
    );

    await waitFor(() => {
      const actions = mockedStore.getActions();
      expect(actions[0].type).toEqual('HIDE_SNACKBAR');
    });
  });

  describe('should be visible on', () => {
    beforeEach(async () => {
      await store.dispatch(UiActions.hideSnackbar());
    });

    it('note creation', () => {
      const note: NoteInterface = getMockedNote();
      render(<ProvidedApp />);

      act(() => {
        store
          .dispatch(NoteActions.create(note) as unknown as AnyAction)
          .then(() => {
            expect(screen.findByTestId(snackbarTestId)).toBeTruthy();
          })
          .catch();
      });
    });

    it('category creation', () => {
      const category: Category = getMockedCategory();
      render(<ProvidedApp />);

      act(() => {
        store
          .dispatch(CategoryActions.createFromTemporary(category) as unknown as AnyAction)
          .then(async () => {
            expect(screen.findByTestId(snackbarTestId)).toBeTruthy();
          })
          .catch();
      });
    });

    it('note deletion', () => {
      const note: NoteInterface = getMockedNote();
      render(<ProvidedApp />);

      act(() => {
        store
          .dispatch(NoteActions.create(note) as unknown as AnyAction)
          .then(() => {
            store
              .dispatch(NoteActions.deleteNote(note.id) as unknown as AnyAction)
              .then(() => {
                // "2": note created, deleted
                expect(screen.queryAllByTestId(snackbarTestId)).toHaveLength(2);
              })
              .catch();
          })
          .catch();
      });
    });

    it('category deletion', () => {
      const category: Category = getMockedCategory();
      render(<ProvidedApp />);

      act(() => {
        store
          .dispatch(CategoryActions.createFromTemporary(category) as unknown as AnyAction)
          .then(() => {
            store
              .dispatch(CategoryActions.deleteCategory(category) as unknown as AnyAction)
              .then(() => {
                // "2": category created, deleted
                expect(screen.queryAllByTestId(snackbarTestId)).toHaveLength(2);
              })
              .catch();
          })
          .catch();
      });
    });

    it('note restoration', () => {
      const note: NoteInterface = getMockedNote();
      render(<ProvidedApp />);

      act(() => {
        store
          .dispatch(NoteActions.create(note) as unknown as AnyAction)
          .then(() => {
            store
              .dispatch(NoteActions.deleteNote(note.id) as unknown as AnyAction)
              .then(() => {
                store
                  .dispatch(NoteActions.restoreNote(note) as unknown as AnyAction)
                  .then(() => {
                    // "2": note created, deleted, restored
                    expect(screen.queryAllByTestId(snackbarTestId)).toHaveLength(3);
                  })
                  .catch();
              })
              .catch();
          })
          .catch();
      });
    });

    it('category restoration', () => {
      const category: Category = getMockedCategory();
      render(<ProvidedApp />);

      act(() => {
        store
          .dispatch(CategoryActions.createFromTemporary(category) as unknown as AnyAction)
          .then(() => {
            store
              .dispatch(CategoryActions.deleteCategory(category) as unknown as AnyAction)
              .then(() => {
                store
                  .dispatch(CategoryActions.restoreCategory(category) as unknown as AnyAction)
                  .then(() => {
                    // "3": category created, deleted, restored
                    expect(screen.queryAllByTestId(snackbarTestId)).toHaveLength(3);
                  })
                  .catch();
              })
              .catch();
          })
          .catch();
      });
    });
  });
});