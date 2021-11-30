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
import { RouterUtil } from '../domain/utils/router.util';
import { debounce } from '@material-ui/core';

export const ShortcutsDialog = (): ReactElement => {
  const { t } = useTranslation('SHORTCUTS_DIALOG');
  const opened: boolean = useSelector(selectShortcutsDialogOpened);
  const dispatch = useDispatch();
  const history = useHistory();
  const [shortcutsList, setShortcutsList] = useState<ReactElement[]>([]);
  const dialogConfig: DialogConfig = {
    width: '800px',
    height: '100%',
    flex: true,
    smallerPadding: true,
  };

  useEffect(() => {
    dispatch(UiActions.openShortcutsDialog());
    renderShortcutsList();

    return () => {
      dispatch(UiActions.closeShortcutsDialog());
    };
  }, []);

  const renderShortcutsList = debounce((): void => {
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
  }, 200);

  const handleClose = (): void => {
    RouterUtil.back(history);
  };

  return (
    <Dialog
      opened={ opened }
      config={ dialogConfig }
      testid={ shortcutsDialogTestId }
      onClose={ handleClose }
    >
      <DialogTitle>{ t('COMMON:SHORTCUTS') }</DialogTitle>

      <ShortcutsList>
        { shortcutsList }
      </ShortcutsList>

      <DialogControls>
        <Button onClick={ handleClose } variant={ Variant.Regular }>
          { t('COMMON:CLOSE') }
        </Button>
      </DialogControls>
    </Dialog>
  );
};
