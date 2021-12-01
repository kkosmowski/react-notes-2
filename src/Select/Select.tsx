import { MouseEvent, ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { SelectOption } from './select-option.interface';
import { Label } from '../Label/Label';
import { useTranslation } from 'react-i18next';
import { Backdrop } from '../Backdrop/Backdrop';
import {
  CurrentOption,
  CustomSelect,
  Option,
  OptionsContainer,
  OptionText,
  SelectWrapper
} from './Select.styled';
import { SELECT_OPTION_HEIGHT, SELECT_OPTIONS_MAX_HEIGHT } from '../domain/consts/select.consts';
import { Checkbox } from '../Checkbox/Checkbox';
import { useSelector } from 'react-redux';
import { selectLanguage } from '../store/selectors/settings.selectors';
import { debounce } from '@mui/material';
import {
  MAX_OPTION_LABEL_LENGTH_WHEN_MORE_THAN_ONE,
  MAX_OPTIONS_IN_CURRENT_VALUE
} from './select.consts';

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
  const [andMore, setAndMore] = useState('');
  const language = useSelector(selectLanguage);
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

  const renderCurrentValue = useCallback(debounce(() => {
    if (language) {
      if (multi) {
        const n = Math.max(0, values.length - MAX_OPTIONS_IN_CURRENT_VALUE);
        const textArray = [...values]
          .slice(0, MAX_OPTIONS_IN_CURRENT_VALUE)
          .map(value => findLabelOfValueAndSliceIt(value, values.length > 1))
          .join(', ');

        setCurrentValueText(textArray);

        setAndMore(n > 0 ? `+ ${ n }` : '');
      } else if (values.length === 1) {
        const label = findLabelOfValueAndSliceIt(values[0]);

        if (label) {
          setCurrentValueText(label);
        }
        setAndMore('');
      }
    }
  }, 0), [values, language]);

  useEffect(() => {
    renderCurrentValue();
  }, [renderCurrentValue]);

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

  const findLabelOfValueAndSliceIt = (value: string, slice?: boolean): string | '' => {
    const option = options.find(o => o.value === value);

    if (option) {
      const value = option.translate ? t(option.label) : option.label;
      return slice && value.length > MAX_OPTION_LABEL_LENGTH_WHEN_MORE_THAN_ONE
        ? value.slice(0, MAX_OPTION_LABEL_LENGTH_WHEN_MORE_THAN_ONE).trimRight() + '...'
        : value;
    }
    return '';
  };

  const handleOptionClick = (e: MouseEvent<HTMLElement>): void => {
    if (disabled) {
      e.stopPropagation();
      return;
    }

    const target = e.target as HTMLElement;
    const selectedValue = target.dataset.value || target.parentElement?.dataset.value;
    console.log(selectedValue);
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

    console.log(newValues);
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
            <span>{ currentValueText || placeholder }</span>
            <span>{ andMore }</span>
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
                <OptionText>{ option.translate ? t(option.label) : option.label }</OptionText>
              </Option>
            ))}
          </OptionsContainer>
        </CustomSelect>
      </SelectWrapper>
      { optionsVisible && <Backdrop onClick={ toggleOptionsVisibility } /> }
    </div>
  );
};
