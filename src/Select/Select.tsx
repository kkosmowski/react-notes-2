import { MouseEvent, ReactElement, useEffect, useState } from 'react';
import { SelectOption } from './select-option.interface';
import { Label } from '../Label/Label';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import { Backdrop } from '../Backdrop/Backdrop';
import {
  CurrentOption,
  CustomSelect,
  Option,
  OptionsContainer,
  SelectWrapper
} from './Select.styled';

interface Props {
  label?: string;
  options: SelectOption[];
  initialValue?: string;
  multi?: boolean;
  onChange: (value: string) => void;
}

export const Select = ({ options, label, initialValue, multi, onChange }: Props): ReactElement => {
  const id = uuidv4();
  const [value, setValue] = useState<string | undefined>(initialValue);
  const [optionsVisible, setOptionsVisible] = useState<boolean>(false);
  const { t } = useTranslation();

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
    <>
      <SelectWrapper opened={ optionsVisible }>
        { label && <Label>{ label }</Label> }
        <CustomSelect onClick={ toggleOptionsVisibility }>
          <CurrentOption>{ value && t(options.find(o => o.value === value)!.label) }</CurrentOption>
          <OptionsContainer visible={ optionsVisible }>
            { options.map(({ label, value, translate }) => (
              <Option
                onClick={ handleOptionClick }
                data-parent={ id }
                data-value={ value }
                key={ value }
              >
                { translate ? t(label) : label }
              </Option>
            ))}
          </OptionsContainer>
        </CustomSelect>
      </SelectWrapper>
      { optionsVisible && <Backdrop onClick={ toggleOptionsVisibility } /> }
    </>
  );
};
