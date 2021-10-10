import { MockStoreEnhanced } from 'redux-mock-store';
import { RootState } from '../store/interfaces/root-state.interface';
import { act, render, screen, waitFor } from '@testing-library/react';
import { ProvidedApp } from '../App';
import store from '../store/store';
import NoteActions from '../store/actionCreators/note.action-creators';
import { getMockedNote } from '../utils/get-mocked-note.util';
import { NoteInterface } from '../domain/interfaces/note.interface';
import { AnyAction } from 'redux';
import { snackbarTestId } from '../domain/consts/test-ids.consts';

describe('Snackbar', () => {
  let mockedStore: MockStoreEnhanced<RootState>;

  describe('should be visible on', () => {
    it('note creation', () => {
      const note: NoteInterface = getMockedNote();
      render(<ProvidedApp />);

      return store
        .dispatch(NoteActions.create(note) as unknown as AnyAction)
        .then(async () => {
          await waitFor(() => {
            expect(screen.queryByTestId(snackbarTestId)).toBeTruthy();
          });
        })
        .catch();
    });

    it('note deletion', () => {
      const note: NoteInterface = getMockedNote();
      render(<ProvidedApp />);

      act(() => {
        return store
          .dispatch(NoteActions.create(note) as unknown as AnyAction)
          .then(() => {
            store
              .dispatch(NoteActions.deleteNote(note.id) as unknown as AnyAction)
              .then(async () => {
                await waitFor(() => {
                  expect(screen.queryByTestId(snackbarTestId)).toBeTruthy();
                });
              })
              .catch();
          })
          .catch();
      });
    });
  });
});