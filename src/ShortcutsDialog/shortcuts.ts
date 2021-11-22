export interface Shortcuts {
  general: Record<string, string>;
  miscellaneous: Record<string, string>;
}

const SHORTCUTS: Shortcuts = {
  general: {
    N: 'OPEN_ADD_NEW_NOTE_DIALOG',
    C: 'CREATE_NEW_CATEGORY',
    E: 'EDIT_NOTE',
    O: 'OPEN_CURRENTLY_SELECTED_NOTE',
    'D, Delete, Backspace': 'DELETE_SELECTED_NOTE_OR_NOTES',
    A: 'ARCHIVE_OR_RESTORE_SELECTED_NOTE_OR_NOTES',
    S: 'OPEN_SETTINGS',
    Escape: 'CLOSE_MOST_RECENT_DIALOG_OR_SETTINGS',
    Enter: 'CONFIRM_ACTION',
    '0-9': 'CATEGORY_QUICK_SELECT',
    '/': 'OPEN_SHORTCUTS_DIALOG',
  },
  miscellaneous: {
    NOTE_SHIFT_CLICK: 'TOGGLE_MULTISELECT_WHEN_HOLD',
    NOTE_DOUBLE_CLICK: 'OPEN_CLICKED_NOTE',
    APP_DOUBLE_CLICK: 'CLEAR_SELECTION_AND_TURN_SINGLE_SELECT',
    NOTE_RIGHT_CLICK: 'OPEN_NOTE_CONTEXT_MENU',
    SIDEBAR_CLICK: 'PERSIST_OPENED_SIDEBAR',
    APP_CLICK_AND_DRAG: 'MANUAL_NOTES_SELECTION',
  }
};

export default SHORTCUTS;