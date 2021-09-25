import { ChangeEvent, ReactElement } from 'react';
import { InputOrTextarea } from '../domain/types/input-or-textarea.type';
import { Input, InputWrapper, Label, TextArea, Wrapper } from './InputWithLabel.styled';

interface Props {
  id: string;
  label: string;
  value: any;
  type?: 'text' | 'textarea';
  disabled?: boolean;
  onChange: (event: ChangeEvent<InputOrTextarea>) => void;
  onDoubleClick: (id: string) => void;
}

export const InputWithLabel = (
  { id, label, value, type, disabled, onChange, onDoubleClick }: Props
): ReactElement => {
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
            onChange={ onChange }

            id={ id }
            value={ value }
            disabled={ disabled }
          />
          : <Input
            onChange={ onChange }
            type="text"
            id={ id }
            value={ value }
            disabled={ disabled }
          />
        }
      </InputWrapper>
    </Wrapper>
  );
};