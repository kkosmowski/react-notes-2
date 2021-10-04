import { MouseEvent, ReactElement, useEffect, useRef, useState } from 'react';
import { Delete, Edit, Folder, FolderOpen, Save } from '@material-ui/icons';
import { Category } from '../domain/interfaces/category.interface';
import { ListItem } from './styles/CategoryListItem.styled';
import { useTranslation } from 'react-i18next';
import { Button } from '../Button/Button';
import { Color } from '../domain/enums/color.enum';
import { Variant } from '../domain/enums/variant.enum';
import { NIL } from 'uuid';
import { stopPropagation } from '../utils/stop-propagation.util';

interface Props {
  onSelect: (category: Category) => void;
  onUpdate: (category: Category) => void;
  onSave: (name: string) => void;
  onDelete: (category: Category) => void;
  onCancel: () => void;
  data: Category;
  selected: boolean;
  edited: boolean;
}

export const CategoryListItem = (
  { data, selected, edited, onSelect, onSave, onUpdate, onCancel, onDelete }: Props
): ReactElement => {
  const { t } = useTranslation('SIDEBAR');
  const [originalName, setOriginalName] = useState<string>(data.name);
  const [name, setName] = useState<string>(data.name);
  const [editMode, setEditMode] = useState<boolean>(false);
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const saveButtonId = 'save-category';
  const canBeEdited = useRef<boolean>(data.id !== NIL);

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
    if (selected) {
      className += '--selected';
    }
    if (edited) {
      className += ' --edited';
    }
    return className;
  };

  const handleSelect = (): void => {
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

  const handleSave = (e: MouseEvent): void => {
    e.stopPropagation();
    if (editMode) {
      if (name !== originalName) {
        onUpdate({ ...data, name });
        setOriginalName(name);
      }
    } else {
      onSave(name);
    }
    setEditMode(false);
  };

  const handleEditModeToggle = (e: MouseEvent): void => {
    e.stopPropagation();
    setEditMode(!editMode);
  };

  const EditModeView: ReactElement = (
    <>
      <input
        onClick={ stopPropagation }
        onChange={ (event) => setName(event.target.value) }
        onBlur={ handleBlur }
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

  const handleDelete = (e: MouseEvent): void => {
    e.stopPropagation();
    onDelete(data);
  };

  const RegularView: ReactElement = (
    <>
      <span>{ data.name }</span>
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
    <ListItem onClick={ handleSelect } className={ getListItemClasses() }>
      { selected ? <FolderOpen className="icon --selected" /> : <Folder className="icon" /> }
      { edited || editMode ? EditModeView : RegularView }
    </ListItem>
  );
};