import { SnackbarInstance } from '../domain/interfaces/snackbar-instance.interface';
import { v4 } from 'uuid';
import { getMockedNote } from './get-mocked-note.util';
import { HistoryUtil } from '../domain/utils/history.util';

export const getMockedSnackbarInstance = (): SnackbarInstance => ({
  id: v4(),
  details: {
    action: {
      type: 'CREATE_NOTE_SUCCESS',
      payload: getMockedNote(),
    },
    reversible: HistoryUtil.isReversible('CREATE_NOTE_SUCCESS')
  },
});