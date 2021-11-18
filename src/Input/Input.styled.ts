import styled, { css } from 'styled-components/macro';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const InputStyles = css`
  padding: 8px 24px;
  font: inherit;
  background-color: var(--foreground-4);
  border-radius: 2px;
  line-height: 1.5;
  color: var(--foreground);
  outline: none;
  border: 2px solid transparent;

  &[disabled] {
    padding: 8px;
    background-color: transparent;
    resize: none;
  }
  
  &:not([disabled]):hover {
    background-color: var(--foreground-7);
  }
  
  &:not([disabled]):focus {
    border-color: var(--foreground-16);
  }
  
  &:invalid.--touched {
    border-color: var(--warn300);
  }
`;

export const StyledInput = styled.input`${ InputStyles }`;

export const TextArea = styled.textarea`
  ${ InputStyles };
  min-height: 140px;
  resize: vertical;
`;