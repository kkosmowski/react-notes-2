import { createAction } from '@reduxjs/toolkit';

const uiActions = {
  openNoteDialog: createAction('ui/openNoteDialog'),
  closeNoteDialog: createAction('ui/closeNoteDialog'),

  openConfirmationDialog: createAction('ui/openConfirmationDialog'),
  closeConfirmationDialog: createAction('ui/closeConfirmationDialog'),

  openSidebar: createAction('ui/openSidebar'),
  closeSidebar: createAction('ui/closeSidebar'),
};

export default uiActions;