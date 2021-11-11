import { ChangeEvent, ReactElement, useRef } from 'react';
import { InputOrTextarea } from '../domain/types/input-or-textarea.type';
import { Input, InputWrapper, Label, TextArea, Wrapper } from './InputWithLabel.styled';

interface Props {
  id: string;
  label: string;
  value: any;
  type?: 'text' | 'textarea';
  disabled?: boolean;
  required?: boolean;
  testid?: string;
  onChange: (event: ChangeEvent<InputOrTextarea>) => void;
  onDoubleClick: (id: string) => void;
}

export const InputWithLabel = (
  { id, label, value, type, disabled, required, testid, onChange, onDoubleClick }: Props
): ReactElement => {
  const touched = useRef<boolean>(false);

  const handleChange = (e: ChangeEvent<InputOrTextarea>): void => {
    touched.current = true;
    onChange(e);
  };

  const handleDoubleClick = (): void => {
    if (disabled) {
      onDoubleClick(id);
    }
  };

  return (
    <Wrapper>
      <Label>{ label }</Label>
      <InputWrapper onDoubleClick={ handleDoubleClick }>
        { type === 'textarea'
          ? <TextArea
            onChange={ handleChange }
            className={ touched.current ? '--touched' : '' }
            id={ id }
            value={ value }
            disabled={ disabled }
            required={ required }
            data-testid={ testid }
          />
          : <Input
            onChange={ handleChange }
            className={ touched.current ? '--touched' : '' }
            type="text"
            id={ id }
            value={ value }
            disabled={ disabled }
            required={ required }
            data-testid={ testid }
          />
        }
      </InputWrapper>
    </Wrapper>
  );
};