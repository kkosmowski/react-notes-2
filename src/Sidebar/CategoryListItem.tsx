import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { Folder, FolderOpen, Save } from '@material-ui/icons';
import { Category } from '../domain/interfaces/category.interface';
import { ListItem } from './styles/CategoryListItem.styles';
import { useTranslation } from 'react-i18next';

interface Props {
  onSelect: (category: Category) => void;
  onSave: (name: string) => void;
  onCancel: () => void;
  data: Category;
  selected: boolean;
  edited: boolean;
}

export const CategoryListItem = ({ data, selected, edited, onSelect, onSave, onCancel }: Props): ReactElement => {
  const { t } = useTranslation('SIDEBAR');
  const [name, setName] = useState<string>(data.name);
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const saveButtonId: string = 'save-category';

  useEffect(() => {
    if (edited) {
      nameInputRef.current?.focus();
    }
  }, [edited]);

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
        onCancel();
      }
    });
  };

  const EditModeView: ReactElement = (
    <>
      <input
        onChange={ (event) => setName(event.target.value) }
        onBlur={ handleBlur }
        value={ name }
        ref={ nameInputRef }
        className="input --text category-name"
        placeholder={ t('CATEGORY_NAME_PLACEHOLDER') }
        type="text"
      />
      <button
        id={ saveButtonId }
        onClick={ () => onSave(name) }
        className="button --icon --primary"
        type="button"
      >
        <Save />
      </button>
    </>
  );

  const RegularView: ReactElement = <span>{ data.name }</span>;

  return (
    <ListItem onClick={ handleSelect } className={ getListItemClasses() }>
      { selected ? <FolderOpen className="icon --selected" /> : <Folder className="icon" /> }
      { edited ? EditModeView : RegularView }
    </ListItem>
  );
};