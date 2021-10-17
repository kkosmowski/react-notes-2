import { MouseEvent, ReactElement, useEffect, useRef, useState } from 'react';
import { Delete, Edit, Folder, FolderOpen, Save } from '@material-ui/icons';
import { Category } from '../domain/interfaces/category.interface';
import { ListItem } from './styles/CategoryListItem.styled';
import { useTranslation } from 'react-i18next';
import { Button } from '../Button/Button';
import { Color } from '../domain/enums/color.enum';
import { Variant } from '../domain/enums/variant.enum';
import { stopPropagation } from '../utils/stop-propagation.util';
import { isRootCategory } from '../utils/is-root-category.util';

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
  const [originalName, setOriginalName] = useState<string>(data.name);
  const [name, setName] = useState<string>(data.name);
  const [editMode, setEditMode] = useState<boolean>(false);
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const saveButtonId = 'save-category';
  const canBeEdited = useRef<boolean>(!isRootCategory(data.id));

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

  const handleSelect = (e: MouseEvent): void => {
    e.stopPropagation();
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
      <span title={ data.name }>{ data.name }</span>
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
      { current ? <FolderOpen className="icon --current" /> : <Folder className="icon" /> }
      { edited || editMode ? EditModeView : RegularView }
    </ListItem>
  );
};