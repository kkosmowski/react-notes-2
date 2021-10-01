import { NoteInterface } from '../domain/interfaces/note.interface';
import { MockStoreEnhanced } from 'redux-mock-store';
import { mockStore } from '../utils/mock.store';
import { initialNoteState } from '../store/reducers/note.reducer';
import NoteActions from '../store/actionCreators/note.action-creators';
import { AnyAction } from 'redux';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { NotesContainer } from './NotesContainer';
import { noNotesTextTestId, noteTestId } from '../domain/consts/test-ids.consts';
import { initialRootState } from '../utils/initial-root-state';
import { RootState } from '../store/interfaces/root-state.interface';
import { getMockedNote } from '../utils/get-mocked-note.util';

describe('NotesContainer', () => {
  let store: MockStoreEnhanced<RootState>;
  let notes: NoteInterface[];

  it('should show appropriate text when there are no notes', () => {
    store = mockStore(initialRootState);

    return store
      .dispatch((NoteActions.get() as unknown as AnyAction))
      .then(() => {
        const { queryByTestId } = render(
          <Provider store={ store }>
            <NotesContainer />
          </Provider>
        );

        expect(queryByTestId(noNotesTextTestId)).toBeInTheDocument();
      });
  });

  it('should display notes if they are stored in redux', () => {
    notes = [getMockedNote(), getMockedNote(), getMockedNote()];
    store = mockStore({
      ...initialRootState,
      note: {
        ...initialNoteState,
        notes,
      }
    });

    return store
      .dispatch((NoteActions.get() as unknown as AnyAction))
      .then(() => {
        setTimeout(() => { // @todo: check if there's a better way
          const { queryAllByTestId } = render(
            <Provider store={ store }>
              <NotesContainer />
            </Provider>
          );

          expect(queryAllByTestId(noteTestId).every((item) => !!item.dataset.testid)).toBeTruthy();
          expect(queryAllByTestId(noteTestId).length).toEqual(notes.length);
        });
      });
  });
});