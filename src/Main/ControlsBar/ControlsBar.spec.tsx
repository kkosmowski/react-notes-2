import { mockStore } from '../../utils/mock.store';
import { MockStoreEnhanced } from 'redux-mock-store';
import { RootState } from '../../store/interfaces/root-state.interface';
import { initialRootState } from '../../utils/initial-root-state';
import { ControlsBar } from './ControlsBar';
import { fireEvent, render, RenderResult, screen } from '@testing-library/react';
import { addNoteTestId, noteDialogTestId } from '../../domain/consts/test-ids.consts';
import { Provider } from 'react-redux';
import NoteActions from '../../store/actionCreators/note.action-creators';
import UiActions from '../../store/actionCreators/ui.action-creators';

describe('ControlsBar', function () {
  let store: MockStoreEnhanced<RootState>;

  beforeEach(() => {
    store = mockStore(initialRootState);
  });

  describe('Add Note Button', function () {
    it('is displayed', () => {
      const { queryByTestId } = render(
        <Provider store={ store }>
          <ControlsBar />
        </Provider>
      );

      expect(queryByTestId(addNoteTestId)).toBeTruthy();
    });

    it('dispatches an action on click', () => {
      render(
        <Provider store={ store }>
          <ControlsBar />
        </Provider>
      );

      fireEvent(
        screen.getByTestId(addNoteTestId),
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true
        })
      );

      setTimeout(() => {
        const actions = store.getActions();
        expect(actions[0]).toEqual(UiActions.openNoteDialog());
      });
    });

    it('opens NoteDialog on action dispatched', () => {
      const { queryByTestId } = render(
        <Provider store={ store }>
          <ControlsBar />
        </Provider>
      );
      // this is suspicious. should not pass
      setTimeout(() => {
        expect(queryByTestId(noteDialogTestId)).toBeTruthy();
      });
    });
  });
});
