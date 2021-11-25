import { KeyboardEvent, MouseEvent, ReactElement, useEffect, useRef, useState } from 'react';
import { Delete, Edit, Folder, FolderOpen, Save } from '@material-ui/icons';
import { Category } from '../domain/interfaces/category.interface';
import { ListItem, StyledFolderIcon } from './styles/CategoryListItem.styled';
import { useTranslation } from 'react-i18next';
import { Button } from '../Button/Button';
import { Color } from '../domain/enums/color.enum';
import { Variant } from '../domain/enums/variant.enum';
import { stopPropagation } from '../utils/stop-propagation.util';
import { isRootCategory } from '../utils/is-root-category.util';
import { Coords } from '../domain/interfaces/coords.interface';
import { handleEventAndReturnCoords } from '../ContextMenu/handle-event-and-return-coords.util';
import UiActions from '../store/actionCreators/ui.action-creators';
import { useDispatch } from 'react-redux';
import { rootCategory } from '../domain/consts/root-category.const';

interface Props {
  onSelect: (category: Category) => void;
  onUpdate: (category: Category) => void;
  onSave: (name: string) => void;
  onDelete: (category: Category) => void;
  onCancel: () => void;
  data: Category;
  current: boolean;
  edited: boolean;
}

export const CategoryListItem = (
  { data, current, edited, onSelect, onSave, onUpdate, onCancel, onDelete }: Props
): ReactElement => {
  const { t } = useTranslation('SIDEBAR');
  const [name, setName] = useState<string>(data.name);
  const [editMode, setEditMode] = useState<boolean>(false);
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const saveButtonId = 'save-category';
  const canBeEdited = useRef<boolean>(!isRootCategory(data.id));
  const dispatch = useDispatch();

  useEffect(() => {
    setName(data.name);
  }, [setName, data]);

  useEffect(() => {
    if (edited) {
      nameInputRef.current?.focus();
    }
  }, [edited]);

  useEffect(() => {
    if (editMode) {
      nameInputRef.current!.focus();
    }
  }, [editMode]);

  const getListItemClasses = (): string => {
    let className = '';
    if (current) {
      className += '--current';
    }
    if (edited) {
      className += ' --edited';
    }
    return className;
  };

  const handleSelect = (e?: MouseEvent): void => {
    e && e.stopPropagation();
    if (!edited) {
      onSelect(data);
    }
  };

  const handleBlur = (): void => {
    setTimeout(() => {
      if (document.activeElement?.id !== saveButtonId) {
        edited ? onCancel() : setEditMode(false);
      }
    });
  };

  const handleKeyDown = (event: KeyboardEvent): void => {
    event.stopPropagation();
  };

  const handleSave = (e?: MouseEvent): void => {
    e && e.stopPropagation();
    if (editMode) {
      if (name !== data.name) {
        onUpdate({ ...data, name });
      }
    } else {
      onSave(name);
    }
    setEditMode(false);
  };

  const handleEditModeToggle = (e?: MouseEvent): void => {
    e && e.stopPropagation();
    dispatch(UiActions.openSidebar());
    setName(data.name);
    setEditMode(!editMode);
  };

  const handleColorChange = (): void => {
    dispatch(UiActions.openColorDialog('category', data));
  };

  const EditModeView: ReactElement = (
    <>
      <input
        onClick={ stopPropagation }
        onChange={ (event) => setName(event.target.value) }
        onBlur={ handleBlur }
        onKeyDown={ handleKeyDown }
        value={ name }
        ref={ nameInputRef }
        className="input --text category-name"
        placeholder={ t('CATEGORY_NAME_PLACEHOLDER') }
        type="text"
      />
      <Button
        id={ saveButtonId }
        onClick={ handleSave }
        color={ Color.Primary }
        variant={ Variant.Icon }
      >
        <Save />
      </Button>
    </>
  );

  const handleDelete = (e?: MouseEvent): void => {
    e && e.stopPropagation();
    onDelete(data);
  };

  const handleContextMenu = (e: MouseEvent): void => {
    const coords: Coords = handleEventAndReturnCoords(e);

    dispatch(UiActions.openSidebar());
    dispatch(UiActions.showContextMenu({
      coords,
      items: [
        {
          label: 'COMMON:SELECT',
          callback: () => handleSelect(),
        },
        {
          label: 'COMMON:EDIT',
          callback: () => handleEditModeToggle(),
        },
        {
          label: 'COMMON:CHANGE_COLOR',
          callback: () => handleColorChange(),
        },
        {
          label: 'COMMON:DELETE',
          callback: () => handleDelete(),
          warn: true,
        },
      ]
    }));
  };

  const RegularView: ReactElement = (
    <>
      { data.id === rootCategory.id
        ? <span title={ t(data.name) }>{ t(data.name) }</span>
        : <span title={ data.name }>{ data.name }</span>
      }
      { canBeEdited.current
        ? (
          <>
            <Button
              onClick={ handleEditModeToggle }
              color={ Color.Primary }
              variant={ Variant.GhostIcon }
            >
              <Edit />
            </Button>

            <Button
              onClick={ handleDelete }
              id={ saveButtonId }
              color={ Color.Warn }
              variant={ Variant.GhostIcon }
            >
              <Delete />
            </Button>
          </>
        )
        : null
      }
    </>
  );

  return (
    <ListItem
      onClick={ handleSelect }
      onContextMenu={ handleContextMenu }
      className={ getListItemClasses() }
      color={ data.color }
    >
      { current
        ? <FolderOpen className="icon --current" />
        : <StyledFolderIcon className="icon" iconColor={ data.color } />
      }
      { edited || editMode ? EditModeView : RegularView }
    </ListItem>
  );
};