import { ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog } from '../Dialog/Dialog';
import { DialogConfig } from '../domain/interfaces/dialog-config.interface';
import { useDispatch, useSelector } from 'react-redux';
import UiActions from '../store/actionCreators/ui.action-creators';
import { selectShortcutsDialogOpened } from '../store/selectors/ui.selectors';
import { shortcutsDialogTestId } from '../domain/consts/test-ids.consts';
import { DialogTitle } from '../Dialog/DialogTitle';
import { DialogControls } from '../Dialog/styles/Dialog.styled';
import { Button } from '../Button/Button';
import { Variant } from '../domain/enums/variant.enum';
import { useHistory } from 'react-router-dom';
import SHORTCUTS from './shortcuts';
import { Explanation, Key, ListItem, ShortcutsList, Spacer } from './ShortcutsDialog.styled';

export const ShortcutsDialog = (): ReactElement => {
  const { t } = useTranslation('SHORTCUTS_DIALOG');
  const opened: boolean = useSelector(selectShortcutsDialogOpened);
  const dispatch = useDispatch();
  const history = useHistory<{ previous: string }>();
  const [shortcutsList, setShortcutsList] = useState<ReactElement[]>([]);
  const dialogConfig: DialogConfig = {
    width: '800px',
    height: 'auto',
    flex: true
  };

  useEffect(() => {
    dispatch(UiActions.openShortcutsDialog());
    renderShortcutsList();

    return () => {
      dispatch(UiActions.closeShortcutsDialog());
    };
  }, []);

  const renderShortcutsList = (): void => {
    const list = [];

    for (const key in SHORTCUTS.general) {
      list.push(
        <ListItem key={ key }>
          <Key>{ key }</Key>
          <Explanation>{ t(SHORTCUTS.general[key]) }</Explanation>
        </ListItem>
      );
    }

    list.push(<Spacer key="spacer" />);

    for (const key in SHORTCUTS.miscellaneous) {
      list.push(
        <ListItem key={ key }>
          <Key>{ t(key) }</Key>
          <Explanation>{ t(SHORTCUTS.miscellaneous[key]) }</Explanation>
        </ListItem>
      );
    }

    setShortcutsList(list);
  };

  const handleClose = (): void => {
    //@todo refactor the routing
    const pathname = !history.location.state
      ? history.location.state.previous === '/shortcuts'
        ? '/'
        : history.location.state.previous
      : '/';

    history.push(
      { pathname },
      { previous: history.location.state?.previous || '/' }
    );
  };

  return (
    <Dialog
      opened={ opened }
      config={ dialogConfig }
      testid={ shortcutsDialogTestId }
      onClose={ handleClose }
    >
      <DialogTitle>Shortcuts </DialogTitle>

      <ShortcutsList>
        { shortcutsList }
      </ShortcutsList>

      <DialogControls>
        <Button onClick={ handleClose } variant={ Variant.Regular }>
          Close
        </Button>
      </DialogControls>
    </Dialog>
  );
};
