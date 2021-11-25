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

interface Props {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  initialValue?: string;
  multi?: boolean;
  onChange: (value: string) => void;
}

export const Select = ({ options, label, placeholder, initialValue, multi, onChange }: Props): ReactElement => {
  const [value, setValue] = useState<string | undefined>(initialValue);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [openAbove, setOpenAbove] = useState(false);
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


  useEffect(() => { setValue(initialValue); }, [initialValue]);

  const handleOptionClick = (e: MouseEvent<HTMLElement>): void => {
    const selectedValue = (e.target as HTMLElement).dataset?.value;
    if (selectedValue) {
      setValue(selectedValue);
      onChange(selectedValue);
    }
  };

  const toggleOptionsVisibility = (): void => {
    setOptionsVisible(!optionsVisible);
  };

  return (
    <div ref={ ref }>
      <SelectWrapper opened={ optionsVisible }>
        { label && <Label>{ label }</Label> }
        <CustomSelect onClick={ toggleOptionsVisibility }>
          <CurrentOption>
            { value ? t(options.find(o => o.value === value)!.label) : placeholder }
          </CurrentOption>
          <OptionsContainer visible={ optionsVisible } above={ openAbove }>
            { options.map(({ label, value, translate }) => (
              <Option onClick={ handleOptionClick } data-value={ value } key={ value }>
                { translate ? t(label) : label }
              </Option>
            ))}
          </OptionsContainer>
        </CustomSelect>
      </SelectWrapper>
      { optionsVisible && <Backdrop onClick={ toggleOptionsVisibility } /> }
    </div>
  );
};
