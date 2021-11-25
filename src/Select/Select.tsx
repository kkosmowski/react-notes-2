import { MouseEvent, ReactElement, useEffect, useRef, useState } from 'react';
import { SelectOption } from './select-option.interface';
import { Label } from '../Label/Label';
import { useTranslation } from 'react-i18next';
import { Backdrop } from '../Backdrop/Backdrop';
import {
  CurrentOption,
  CustomSelect,
  Option,
  OptionsContainer,
  SelectWrapper
} from './Select.styled';
import { SELECT_OPTION_HEIGHT, SELECT_OPTIONS_MAX_HEIGHT } from '../domain/consts/select.consts';
import { Checkbox } from '../Checkbox/Checkbox';

interface Props {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  initialValue?: string | string[];
  multi?: boolean;
  disabled?: boolean;
  onChange: (value: string[]) => void;
}

export const Select = (
  { options, label, placeholder, initialValue, multi, disabled, onChange }: Props
): ReactElement => {
  const [values, setValues] = useState<string[]>([]);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [openAbove, setOpenAbove] = useState(false);
  const [currentValueText, setCurrentValueText] = useState('');
  const ref = useRef<HTMLDivElement | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (options.length && ref && ref.current !== null) {
      const expectedHeight = options.length * SELECT_OPTION_HEIGHT > SELECT_OPTIONS_MAX_HEIGHT
        ? SELECT_OPTIONS_MAX_HEIGHT
        : options.length * SELECT_OPTION_HEIGHT;
      const boundingClientRect = (ref.current as HTMLDivElement).getBoundingClientRect();
      const distanceToBottom = window.innerHeight - boundingClientRect.bottom;

      if (distanceToBottom < expectedHeight) {
        setOpenAbove(true);
      }
    }
  }, [options]);

  useEffect(() => {
    if (multi) {
      const n = Math.max(0, values.length - 2);
      const textValue = [...values.slice(0, 2).map(findLabelOfValue)];
      const text = textValue.join(', ') + (n > 0 ? ` + ${ n }` : '');

      setCurrentValueText(text);
    } else if (values.length === 1) {
      const label = findLabelOfValue(values[0]);

      if (label) {
        setCurrentValueText(label);
      }
    }
  }, [values]);

  useEffect(() => {
    if (initialValue !== undefined) {
      if (typeof initialValue !== 'string' && multi) {
        setValues(initialValue);
      } else if (typeof initialValue === 'string' && !multi) {
        setValues([initialValue]);
      } else {
        throw new Error('Cannot set multiple initial values to a non-multi Select.');
      }
    }
  }, [initialValue]);

  const findLabelOfValue = (value: string): string | null => {
    const option = options.find(o => o.value === value);

    if (option) {
      return option.translate ? t(option.label) : option.label;
    }
    return null;
  };

  const handleOptionClick = (e: MouseEvent<HTMLElement>): void => {
    if (disabled) {
      e.stopPropagation();
      return;
    }

    const selectedValue = (e.target as HTMLElement).dataset?.value;

    if (multi) {
      e.stopPropagation();
      if (selectedValue) {
        handleOptionCheckboxChange(selectedValue);
      }
      return;
    }

    if (selectedValue) {
      setValues([selectedValue]);
      onChange([selectedValue]);
    }
  };

  const handleOptionCheckboxChange = (selected: string): void => {
    if (!multi || disabled) {
      return;
    }

    let newValues: string[];

    if (values.includes(selected)) {
      newValues = values.filter(v => v !== selected);
    } else {
      newValues = [...values, selected];
    }
    setValues(newValues);
    onChange(newValues);
  };

  const toggleOptionsVisibility = (): void => {
    if (options.length) {
      setOptionsVisible(!optionsVisible);
    }
  };

  return (
    <div ref={ ref }>
      <SelectWrapper opened={ optionsVisible }>
        { label && <Label>{ label }</Label> }
        <CustomSelect
          onClick={ toggleOptionsVisibility }
          className={ disabled || !options.length ? 'disabled' : '' }
        >
          <CurrentOption>
            { currentValueText || placeholder }
          </CurrentOption>
          <OptionsContainer visible={ optionsVisible } above={ openAbove }>
            { options.map((option) => (
              <Option onClick={ handleOptionClick } data-value={ option.value } key={ option.value }>
                { multi && (
                  <Checkbox
                    onChange={ (e) => handleOptionCheckboxChange(e.target.value) }
                    type="checkbox"
                    checked={ values.includes(option.value) }
                    value={ option.value }
                    disabled={ disabled }
                    style={ { marginInlineEnd: '8px' } }
                  />
                ) }
                { option.translate ? t(option.label) : option.label }
              </Option>
            ))}
          </OptionsContainer>
        </CustomSelect>
      </SelectWrapper>
      { optionsVisible && <Backdrop onClick={ toggleOptionsVisibility } /> }
    </div>
  );
};
