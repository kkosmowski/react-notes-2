import { NoteInterface } from '../domain/interfaces/note.interface';
import { MockStoreEnhanced } from 'redux-mock-store';
import { mockStore } from '../utils/mock.store';
import { initialNoteState } from '../store/reducers/note.reducer';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { NotesContainer } from './NotesContainer';
import { noNotesTextTestId, noteTestId } from '../domain/consts/test-ids.consts';
import { initialRootState } from '../utils/initial-root-state';
import { RootState } from '../store/interfaces/root-state.interface';
import { getMockedNote } from '../utils/get-mocked-note.util';

describe('NotesContainer', () => {
  let mockedStore: MockStoreEnhanced<RootState>;
  let notes: NoteInterface[];

  it('should show appropriate text when there are no notes', (done) => {
    mockedStore = mockStore(initialRootState);

    const { queryByTestId } = render(
      <Provider store={ mockedStore }>
        <NotesContainer />
      </Provider>
    );

    expect(queryByTestId(noNotesTextTestId)).toBeInTheDocument();
    done();
  });

  it('should display notes if they are fetched', (done) => {
    notes = [getMockedNote(), getMockedNote(), getMockedNote()];
    mockedStore = mockStore({
      ...initialRootState,
      note: {
        ...initialNoteState,
        notes,
      }
    });

    const { queryAllByTestId } = render(
      <Provider store={ mockedStore }>
        <NotesContainer />
      </Provider>
    );

    expect(queryAllByTestId(noteTestId).every((item) => !!item.dataset.testid)).toBeTruthy();
    expect(queryAllByTestId(noteTestId).length).toEqual(notes.length);
    done();
  });
});