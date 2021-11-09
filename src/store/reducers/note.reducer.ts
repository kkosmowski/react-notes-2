import { NoteState } from '../interfaces/note-state.interface';
import { NoteInterface } from '../../domain/interfaces/note.interface';
import { NoteSelectionMode } from '../../domain/enums/note-selection-mode.enum';
import { createReducer, Draft } from '@reduxjs/toolkit';
import noteActions from '../actions/note.actions';
import { RemoveFromCategorySuccessPayload } from '../../domain/interfaces/remove-from-category-payload.interface';
import { RemoveMultipleNotesFromCategorySuccesPayload } from '../../domain/interfaces/remove-multiple-notes-from-category-payload.interface';
import { EntityUid } from '../../domain/types/entity-uid.type';

export const initialNoteState: NoteState = {
  notes: [
    {
      "id": "b666d9a5-04de-411f-9260-9413c6d20136",
      "title": "test note 1",
      "content": "Cras vitae nisl a sem efficitur faucibus.",
      "categories": [
        "56875b71-69ec-4ba3-840e-5fd46e1443bf",
        "eb88879e-a5ed-4aa1-8eeb-49e7268b62dd",
        "24e0ecb2-f0ee-49cd-ba0d-e1c6be2968ba"
      ],
      "deleted": false
    },
    {
      "title": "test note 2",
      "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "id": "5f099e76-5e3c-4ee5-8181-208bb904b2e0",
      "categories": [
        "24e0ecb2-f0ee-49cd-ba0d-e1c6be2968ba"
      ],
      "deleted": false
    },
    {
      "title": "test note 3",
      "content": "Nullam pretium libero nec diam ullamcorper cursus.",
      "id": "425647b7-ce5f-4ddb-8356-0e9bd5ffa974",
      "categories": [
        "56875b71-69ec-4ba3-840e-5fd46e1443bf",
        "24e0ecb2-f0ee-49cd-ba0d-e1c6be2968ba"
      ],
      "deleted": false
    },
    {
      "title": "test note 455",
      "content": "Phasellus ut blandit nibh, et molestie sapien. Nullam eget malesuada turpis, et blandit nulla. Praesent faucibus lectus eget semper mattis.",
      "id": "4cc0e8fa-082f-49bd-8f76-2d927643d7bc",
      "categories": [
        "56875b71-69ec-4ba3-840e-5fd46e1443bf"
      ],
      "deleted": false
    },
    {
      "title": "test note 5asd",
      "content": "Hello semper lobortis convallis. Pellentesque quis magna dapibus nisi placerat suscipit. Nulla augue velit, posuere in tincidunt vel, finibus vel est. Nulla sollicitudin eleifend elit, a mattis massa semper eget. Praesent ultrices neque quam, venenatis pharetra magna dignissim sit amet.",
      "id": "f7f711c7-d233-4307-997f-0ff7d522d64e",
      "categories": [
        "56875b71-69ec-4ba3-840e-5fd46e1443bf",
        "24e0ecb2-f0ee-49cd-ba0d-e1c6be2968ba"
      ],
      "deleted": false
    },
    {
      "title": "super duper long note title asdasd",
      "content": "Lorem ipsum",
      "id": "06069df6-359f-4cc2-b778-f7fee5fb8cb6",
      "categories": [
        "eb88879e-a5ed-4aa1-8eeb-49e7268b62dd",
        "18cb4c96-1f0f-4eac-b57a-06837321ee0c",
        "24e0ecb2-f0ee-49cd-ba0d-e1c6be2968ba"
      ],
      "deleted": false
    },
    {
      "title": "geg",
      "content": "gege",
      "categories": [],
      "id": "10c6e1d8-7d7e-4cdf-a63b-a00a4934c2d4",
      "deleted": false
    },
    {
      "title": "ege",
      "content": "gege",
      "categories": [],
      "id": "109f240f-36a6-41e8-a515-0d361d4fc070",
      "deleted": false
    }
  ],
  notesLoading: false,
  noteSelectionMode: NoteSelectionMode.Single,
  openedNote: null,
  noteToOpen: null,
  noteCreationInProgress: false,
  noteUpdateInProgress: false,
  noteDeletionInProgress: false,
  noteRestorationInProgress: false,
  selectedNotes: {},
  noteRemovalFromCategoryInProgress: false,
  noteRestorationToCategoryInProgress: false,
  notesRemovalFromCategoryInProgress: false,
  notesRestorationToCategoryInProgress: false,
};

const removeOrRestoreReducer = (
  state: Draft<NoteState>,
  { payload }: { payload: RemoveFromCategorySuccessPayload }
) => {
  state.notes = state.notes.map((note) => note.id === payload.updatedNote.id
    ? payload.updatedNote
    : note
  );
  state.noteRestorationToCategoryInProgress = false;
};

const removeOrRestoreMultipleReducer = (
  state: Draft<NoteState>,
  { payload }: { payload: RemoveMultipleNotesFromCategorySuccesPayload }
) => {
  const updatedIds: EntityUid[] = payload.updatedNotes.map((note) => note.id);
  state.notes = state.notes.map((note) => updatedIds.includes(note.id)
    ? payload.updatedNotes.find((updated) => updated.id === note.id)!
    : note
  );
  state.notesRemovalFromCategoryInProgress = false;
};

const noteReducer = createReducer(initialNoteState, (builder) => {
  builder
    .addCase(noteActions.getNotes, (state) => {
      state.notesLoading = true;
    })
    .addCase(noteActions.getNotesSuccess, (state, action) => {
      state.notesLoading = false;
      if (action.payload) {
        // state.notes = (action.payload as NoteInterface[]).reverse();
      }
    })
    .addCase(noteActions.getNotesFail, (state) => {
      state.notesLoading = false;
    })

    .addCase(noteActions.createNote, (state) => {
      state.noteCreationInProgress = true;
    })
    .addCase(noteActions.createNoteSuccess, (state, action) => {
      state.noteCreationInProgress = false;
      if (action.payload) {
        // state.notes = [action.payload, ...state.notes];
      }
    })
    .addCase(noteActions.createNoteFail, (state) => {
      state.noteCreationInProgress = false;
    })

    .addCase(noteActions.toggleSelectionMode, (state) => {
      if (state.noteSelectionMode === NoteSelectionMode.Single) {
        state.noteSelectionMode = NoteSelectionMode.Multi;
      } else {
        state.noteSelectionMode = NoteSelectionMode.Single;

        const entries = Object.entries(state.selectedNotes);
        if (entries.length) {
          const onlySelectedEntries = entries.filter(([, selected]) => selected);
          const [id] = onlySelectedEntries[onlySelectedEntries.length - 1];
          state.selectedNotes = { [id]: true };
        }
      }
    })
    .addCase(noteActions.selectNote, (state, { payload }) => {
      if (state.noteSelectionMode === NoteSelectionMode.Multi) {
        state.selectedNotes[payload] = true;
      } else {
        state.selectedNotes = { [payload]: true };
      }
    })
    .addCase(noteActions.deselectNote, (state, { payload }) => {
      state.selectedNotes[payload] = false;
    })
    .addCase(noteActions.clearSelection, (state) => {
      state.selectedNotes = {};
    })

    .addCase(noteActions.setOpenedNote, (state, action) => {
      state.openedNote = action.payload;
    })
    .addCase(noteActions.clearOpenedNote, (state) => {
      state.openedNote = null;
    })
    .addCase(noteActions.findOpenedNote, (state, { payload }) => {
      state.noteToOpen = payload;
    })

    .addCase(noteActions.updateNote, (state) => {
      state.noteUpdateInProgress = true;
    })
    .addCase(noteActions.updateNoteSuccess, (state, action) => {
      state.noteUpdateInProgress = false;
      if (action.payload) {
        const updated: NoteInterface = action.payload;
        state.notes = state.notes.map((note) => note.id === updated.id ? updated : note);
      }
    })
    .addCase(noteActions.updateNoteFail, (state) => {
      state.noteUpdateInProgress = false;
    })

    .addCase(noteActions.deleteNote, (state) => {
      state.noteDeletionInProgress = true;
    })
    .addCase(noteActions.deleteNoteSuccess, (state, { payload }) => {
      state.noteDeletionInProgress = false;
      state.notes = state.notes.map((note) => note.id === payload.id ? payload : note);
    })
    .addCase(noteActions.deleteNoteFail, (state) => {
      state.noteDeletionInProgress = false;
    })

    .addCase(noteActions.restoreNote, (state) => {
      state.noteRestorationInProgress = true;
    })
    .addCase(noteActions.restoreNoteSuccess, (state, { payload }) => {
      const restored: NoteInterface = {
        ...payload,
        deleted: false
      };
      state.notes = state.notes.map((note) => note.id === restored.id ? restored : note);
      state.noteRestorationInProgress = false;
    })
    .addCase(noteActions.restoreNoteFail, (state) => {
      state.noteRestorationInProgress = false;
    })

    .addCase(noteActions.removeNoteFromCategory, (state) => {
      state.noteRemovalFromCategoryInProgress = true;
    })
    .addCase(noteActions.removeNoteFromCategorySuccess, removeOrRestoreReducer)
    .addCase(noteActions.removeNoteFromCategoryFail, (state) => {
      state.noteRemovalFromCategoryInProgress = false;
    })

    .addCase(noteActions.restoreNoteToCategory, (state) => {
      state.noteRestorationToCategoryInProgress = true;
    })
    .addCase(noteActions.restoreNoteToCategorySuccess, removeOrRestoreReducer)
    .addCase(noteActions.restoreNoteToCategoryFail, (state) => {
      state.noteRestorationToCategoryInProgress = false;
    })

    .addCase(noteActions.removeMultipleNotesFromCategory, (state) => {
      state.notesRemovalFromCategoryInProgress = true;
    })
    .addCase(noteActions.removeMultipleNotesFromCategorySuccess, removeOrRestoreMultipleReducer)
    .addCase(noteActions.removeMultipleNotesFromCategoryFail, (state) => {
      state.notesRemovalFromCategoryInProgress = false;
    })

    .addCase(noteActions.restoreMultipleNotesToCategory, (state) => {
      state.notesRemovalFromCategoryInProgress = true;
    })
    .addCase(noteActions.restoreMultipleNotesToCategorySuccess, removeOrRestoreMultipleReducer)
    .addCase(noteActions.restoreMultipleNotesToCategoryFail, (state) => {
      state.notesRemovalFromCategoryInProgress = false;
    });
});

export default noteReducer;
