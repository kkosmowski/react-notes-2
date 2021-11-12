import store from '../store/store';
import NoteActions from '../store/actionCreators/note.action-creators';
import { getMockedNote } from '../utils/get-mocked-note.util';
import { NoteInterface } from '../domain/interfaces/note.interface';
import { AnyAction } from 'redux';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import {
  contextMenuEditButtonTestId,
  contextMenuTestId,
  noteDialogTestId, noteDialogTitleTestId,
  noteSelectedTestId,
  noteTestId
} from '../domain/consts/test-ids.consts';
import { MemoryRouter } from 'react-router-dom';
import { Main } from '../Main/Main';
import userEvent from '@testing-library/user-event';
import { ContextMenu } from '../ContextMenu/ContextMenu';

describe('Note', () => {
  const setup = (withContextMenu = false) => {
    const note: NoteInterface = getMockedNote();

    store.dispatch((NoteActions._getSuccess([note]) as unknown as AnyAction));

    return {
      note,
      ...render(
        <Provider store={ store }>
          <MemoryRouter initialEntries={ ['/'] }>
            <Main />
            { withContextMenu && <ContextMenu/> }
          </MemoryRouter>
        </Provider>
      ),
    };
  };

  it('should be selected on action dispatch', async () => {
    const { note, getByTestId } = setup();

    store.dispatch(NoteActions.selectNote(note.id) as unknown as AnyAction);

    await waitFor(() => {
      expect(getByTestId(noteSelectedTestId)).toBeInTheDocument();
    });
  });

  it('opens NoteDialog on double click', async () => {
    const { getByTestId, getAllByTestId } = setup();

    await waitFor(() => {
      userEvent.dblClick(getAllByTestId(noteTestId)[0]);

      expect(getByTestId(noteDialogTestId)).toBeInTheDocument();
    });
  });

  it('open NoteDialog in edit mode on "Edit" context menu item click', async () => {
    const { getByTestId, getAllByTestId } = setup(true);

    await waitFor(() => {
      fireEvent.contextMenu(getAllByTestId(noteTestId)[0]);
    });

    expect(getByTestId(contextMenuTestId)).toBeInTheDocument();

    await waitFor(() => {
      userEvent.click(getByTestId(contextMenuEditButtonTestId));
    });

    expect(getByTestId(noteDialogTestId)).toBeInTheDocument();
    expect(getByTestId(noteDialogTitleTestId)).toHaveTextContent('Edit note');
  });
});