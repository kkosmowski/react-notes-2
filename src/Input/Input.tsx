import {
  ChangeEvent,
  CSSProperties,
  KeyboardEvent,
  ReactElement,
  useEffect,
  useRef
} from 'react';
import { InputOrTextarea } from '../domain/types/input-or-textarea.type';
import { StyledInput, InputWrapper, TextArea, Wrapper } from './Input.styled';
import { Label } from '../Label/Label';
import { EntityUid } from '../domain/types/entity-uid.type';

interface Props {
  id: string;
  label?: string;
  value: any;
  type?: 'text' | 'number' | 'textarea';
  disabled?: boolean;
  required?: boolean;
  autofocus?: boolean;
  testid?: string;
  onChange: (event: ChangeEvent<InputOrTextarea>) => void;
  onDoubleClick?: (id: EntityUid, disabled?: boolean) => void;
  placeholder?: string;
  style?: CSSProperties;
}

export const Input = ({
  id,
  label,
  value,
  type,
  disabled,
  required,
  testid,
  style,
  autofocus,
  onChange,
  onDoubleClick,
  placeholder
}: Props): ReactElement => {
  const touched = useRef<boolean>(false);
  const ref = useRef<(HTMLInputElement & HTMLTextAreaElement) | null>(null);

  useEffect(() => {
    if (autofocus) {
      setTimeout(() => {
        ref.current && ref.current.focus();
      });
    }
  }, [autofocus]);

  const handleChange = (e: ChangeEvent<InputOrTextarea>): void => {
    touched.current = true;
    onChange(e);
  };

  const handleDoubleClick = (): void => {
    onDoubleClick && onDoubleClick(id, disabled);
  };

  const handleKeyDown = (event: KeyboardEvent): void => {
    event.stopPropagation();
  };

  return (
    <Wrapper>
      { label && <Label>{ label }</Label> }
      <InputWrapper onDoubleClick={ handleDoubleClick }>
        { type === 'textarea'
          ? <TextArea
            onChange={ handleChange }
            onKeyDown={ handleKeyDown }
            className={ touched.current ? '--touched' : '' }
            id={ id }
            value={ value }
            disabled={ disabled }
            required={ required }
            placeholder={ placeholder }
            style={ style }
            ref={ ref }
            data-testid={ testid }
          />
          : <StyledInput
            onChange={ handleChange }
            onKeyDown={ handleKeyDown }
            className={ touched.current ? '--touched' : '' }
            type={ type }
            id={ id }
            value={ value }
            disabled={ disabled }
            required={ required }
            placeholder={ placeholder }
            style={ style }
            ref={ ref }
            data-testid={ testid }
          />
        }
      </InputWrapper>
    </Wrapper>
  );
};