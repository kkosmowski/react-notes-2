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
import { MemoryRouter } from 'react-router-dom';

describe('NotesContainer', () => {
  const setup = (rootState: RootState) => {
    const mockedStore: MockStoreEnhanced<RootState> = mockStore(rootState);

    return render(
      <Provider store={ mockedStore }>
        <MemoryRouter>
          <NotesContainer />
        </MemoryRouter>
      </Provider>
    );
  };

  it('should show appropriate text when there are no notes', () => {
    const { getByTestId } = setup(initialRootState);

    expect(getByTestId(noNotesTextTestId)).toBeInTheDocument();
  });

  it('should display notes if they are fetched', () => {
    const notes: NoteInterface[] = [getMockedNote(), getMockedNote(), getMockedNote()];
    const { getAllByTestId } = setup({
      ...initialRootState,
      note: {
        ...initialNoteState,
        notes,
      }
    });

    expect(getAllByTestId(noteTestId).length).toEqual(notes.length);
  });
});