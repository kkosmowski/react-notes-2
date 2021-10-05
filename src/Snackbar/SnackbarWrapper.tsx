import { ReactElement, useEffect, useState } from 'react';
import { Snackbar } from './Snackbar';
import { EntityUid } from '../domain/types/entity-uid.type';
import { snackbarDuration } from '../domain/consts/snackbar.const';
import { v4 } from 'uuid';

interface SnackbarInstance {
  id: EntityUid;
  duration: number;
}

export const SnackbarWrapper = (): ReactElement => {
  const [snackbars, setSnackbars] = useState<SnackbarInstance[]>([]);

  useEffect(() => {
    setSnackbars([
      { id: v4(), duration: snackbarDuration},
      { id: v4(), duration: snackbarDuration},
    ]);
  }, []);

  return (
    <>
      { snackbars.map((snackbar) => (
        <Snackbar duration={ snackbar.duration } key={ snackbar.id } />
      )) }
    </>
  );
}