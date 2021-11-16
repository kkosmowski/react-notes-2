import { en } from './en';

export const pl: typeof en = {
  COMMON: {
    ADD_NOTE: 'Dodaj notatkę',
    ROOT_CATEGORY: 'Wszystkie',
    CANCEL: 'Anuluj',
    DELETE: 'Usuń',
    SAVE_AND_NEXT: 'Zapisz',
    SAVE_AND_CLOSE: 'Zapisz i zamknij',
    OPEN: 'Otwórz',
    SAVE: 'Zapisz',
    EDIT: 'Edytuj',
    CLOSE: 'Zamknij',
    RESET: 'Resetuj',
    NO_NOTES: 'Brak notatek do wyświetlenia.',
    ARCHIVE: 'Zarchiwizuj',
    RESTORE: 'Przywróć',
  },
  CONTROL_BAR: {
    MULTISELECT: 'Zaznacz wiele',
    SINGLE_SELECTION: 'Pojedyncze zaznaczenie',
    ARCHIVE_NOTE: 'Zarchiwizuj',
    ARCHIVE_NOTES: 'Zarchiwizuj wiele',
    RESTORE_NOTE: 'Przywróć',
    RESTORE_NOTES: 'Przywróć wiele',
    DELETE_NOTE: 'Usuń notatkę',
    DELETE_NOTES: 'Usuń wiele notatek',
    REMOVE_FROM_CATEGORY: 'Usuń z kategorii',
    SHOW_ARCHIVED: 'Pokaż zarchiwizowane',
  },
  SIDEBAR: {
    ADD_CATEGORY: 'Dodaj kategorię',
    CATEGORY_NAME_PLACEHOLDER: 'Nazwa kategorii...',
    SETTINGS: 'Ustawienia',
  },
  NOTE_DIALOG: {
    EDIT_NOTE: 'Edytuj notatkę',
    VIEW_NOTE: 'Notatka',
    TITLE: 'Tytuł',
    CONTENT: 'Treść',
    CATEGORIES: 'Kategorie',
    INVALID_OR_EMPTY_FORM: 'Formularz jest niewypełniony lub zawiera błędy.',
  },
  CONFIRMATION: {
    TITLE: {
      LEAVE_PROGRESS: 'Porzucić zmiany?',
      DELETE_NOTE: 'Usunąć notatkę?',
      DELETE_NOTES: 'Usunąć notatki?',
      DELETE_CATEGORY: 'Usunąć kategori?',
    },
    MESSAGE: {
      LEAVE_PROGRESS: 'Czy na pewno chcesz porzucić swoje zmiany?',
      DELETE_NOTE: 'Czy na pewno chcesz usunąć tę notatkę? Tej operacji nie można cofnąć.',
      DELETE_NOTES: 'Czy na pewno chcesz usunąć te notatki? Tej operacji nie można cofnąć.',
      DELETE_CATEGORY: 'Kategoria nie jest pusta. Czy na pewno chcesz ją usunąć?\nNie usunie to żadnej notatki.',
    },
    CONTROLS: {
      NO_CANCEL: 'Nie, anuluj',
      YES_LEAVE: 'Tak, porzuć',
      YES_DELETE: 'Tak, usuń',
    },
  },
  SNACKBAR: {
    UNDO: 'Cofnij',
    NOTE_CREATED: 'Notatka "{{ name }}" utworzona',
    NOTE_UPDATED: 'Notatka "{{ name }}" zaktualizowana',
    NOTE_UPDATE_REVERTED: 'Cofnięto aktualizację notatki "{{ name }}"',
    NOTE_DELETED: 'Notatka "{{ name }}" usunięta',
    NOTE_ARCHIVED: 'Notatka "{{ name }}" zarchiwizowana',
    NOTE_RESTORED: 'Notatka "{{ name }}" przywrócona',
    MULTIPLE_NOTES_DELETED: 'Wiele notatek usuniętych',
    MULTIPLE_NOTES_ARCHIVED: 'Wiele notatek zarchiwizowanych',
    MULTIPLE_NOTES_RESTORED: 'Wiele notatek przywróconych',
    CATEGORY_CREATED: 'Kategoria "{{ name }}" utworzona',
    CATEGORY_UPDATED: 'Kategoria "{{ name }}" zaktualizowana',
    CATEGORY_UPDATE_REVERTED: 'Cofnięto aktualizację kategorii "{{ name }}"',
    CATEGORY_DELETED: 'Kategoria "{{ name }}" usunięta',
    CATEGORY_RESTORED: 'Kategoria "{{ name }}" przywrócona',
    NOTE_REMOVED_FROM_CATEGORY: 'Notatka "{{ name }}" usunięta z kategorii',
    NOTE_RESTORED_TO_CATEGORY: 'Notatka "{{ name }}" przywrócona do kategorii',
    NOTES_REMOVED_FROM_CATEGORY: 'Wiele notatek usuniętych z kategorii',
    NOTES_RESTORED_TO_CATEGORY: 'Wiele notatek przywróconych do kategorii',
  }
};