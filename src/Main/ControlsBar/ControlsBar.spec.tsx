import { mockStore } from '../../utils/mock.store';
import { MockStoreEnhanced } from 'redux-mock-store';
import { RootState } from '../../store/interfaces/root-state.interface';
import { initialRootState } from '../../utils/initial-root-state';
import { ControlsBar } from './ControlsBar';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
  addNoteButtonTestId,
  noteDialogTestId,
  noteSelectableTestId,
  toggleSelectionModeButtonTestId
} from '../../domain/consts/test-ids.consts';
import { Provider } from 'react-redux';
import UiActions from '../../store/actionCreators/ui.action-creators';
import { App, ProvidedApp } from '../../App';
import { AnyAction } from 'redux';
import store from '../../store/store';
import { getMockedNote } from '../../utils/get-mocked-note.util';
import { initialNoteState } from '../../store/reducers/note.reducer';
import NoteActions from '../../store/actionCreators/note.action-creators';

describe('ControlsBar', function () {
  let mockedStore: MockStoreEnhanced<RootState>;

  describe('Add Note button', function () {
    it('is displayed', (done) => {
      mockedStore = mockStore(initialRootState);

      const { queryByTestId } = render(
        <Provider store={ mockedStore }>
          <ControlsBar />
        </Provider>
      );

      expect(queryByTestId(addNoteButtonTestId)).toBeTruthy();
      done();
    });

    it('dispatches an action on click', (done) => {
      mockedStore = mockStore(initialRootState);

      render(
        <Provider store={ mockedStore }>
          <ControlsBar />
        </Provider>
      );

      fireEvent(
        screen.getByTestId(addNoteButtonTestId),
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true
        })
      );

      const actions = mockedStore.getActions();
      expect(actions[0].type).toEqual('OPEN_NOTE_DIALOG');
      done();
    });

    it('opens NoteDialog on action dispatched', () => {
      return store // real store
        .dispatch(UiActions.openNoteDialog() as unknown as AnyAction)
        .then(() => {
          render(<ProvidedApp />);
          expect(screen.queryByTestId(noteDialogTestId)).toBeTruthy();
        })
        .catch();
    });
  });

  describe('Toggle Selection button', () => {
    it('dispatch an action on click', (done) => {
      const mockedStore = mockStore({
        ...initialRootState,
        note: {
          ...initialNoteState,
          notes: [getMockedNote(), getMockedNote()],
        }
      });

      render(
        <Provider store={ mockedStore }>
          <App />
        </Provider>
      );

      fireEvent(
        screen.getByTestId(toggleSelectionModeButtonTestId),
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true
        })
      );

      const actionsTypes = mockedStore.getActions().map((action) => action.type);
      expect(actionsTypes).toContain('TOGGLE_SELECTION_MODE');
      done();
    });

    it('toggles selection mode on dispatched action', () => {
      return store // real store
        .dispatch(NoteActions._getSuccess([getMockedNote()]) as unknown as AnyAction)
        .then(() => {
          return store
            .dispatch(NoteActions.toggleSelectionMode() as unknown as AnyAction)
            .then(async () => {
              render(<ProvidedApp />);

              await waitFor(() => {
                expect(screen.queryByTestId(noteSelectableTestId)).toBeTruthy();
              });
            })
            .catch();
        })
        .catch();
    });
  });
});
