import { mockStore } from '../../utils/mock.store';
import { MockStoreEnhanced } from 'redux-mock-store';
import { RootState } from '../../store/interfaces/root-state.interface';
import { initialRootState } from '../../utils/initial-root-state';
import { ControlsBar } from './ControlsBar';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
  addNoteButtonTestId,
  noteSelectableTestId,
  toggleSelectionModeButtonTestId
} from '../../domain/consts/test-ids.consts';
import { Provider } from 'react-redux';
import { App } from '../../App';
import { AnyAction } from 'redux';
import store from '../../store/store';
import { getMockedNote } from '../../utils/get-mocked-note.util';
import { initialNoteState } from '../../store/reducers/note.reducer';
import NoteActions from '../../store/actionCreators/note.action-creators';
import { MemoryRouter } from 'react-router-dom';

describe('ControlsBar', function () {
  let mockedStore: MockStoreEnhanced<RootState>;

  describe('Toggle Selection button', () => {
    it('dispatch an action on click', () => {
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

      fireEvent.click(screen.getByTestId(toggleSelectionModeButtonTestId));

      const actionsTypes = mockedStore.getActions().map((action) => action.type);
      expect(actionsTypes).toContain('TOGGLE_SELECTION_MODE');
    });

    it('toggles selection mode on dispatched action', async () => {
      await store.dispatch(NoteActions._getSuccess([getMockedNote()]) as unknown as AnyAction);
      await store.dispatch(NoteActions.toggleSelectionMode() as unknown as AnyAction);

      render(
        <Provider store={ store }>
          <App />
        </Provider>
      );

      await waitFor(() => {
        expect(screen.getByTestId(noteSelectableTestId)).toBeInTheDocument();
      });
    });
  });

  describe('Add Note button', function () {
    it('is displayed', async () => {
      mockedStore = mockStore(initialRootState);

      render(
        <Provider store={ mockedStore }>
          <ControlsBar />
        </Provider>
      );

      expect(screen.getByTestId(addNoteButtonTestId)).toBeInTheDocument();
    });

    it('dispatches an action on click', () => {
      mockedStore = mockStore(initialRootState);

      render(
        <Provider store={ mockedStore }>
          <MemoryRouter>
            <ControlsBar />
          </MemoryRouter>
        </Provider>
      );

      fireEvent.click(screen.getByTestId(addNoteButtonTestId));

      const actions = mockedStore.getActions();
      expect(actions[0].type).toEqual('OPEN_NOTE_DIALOG');
    });
  });
});
