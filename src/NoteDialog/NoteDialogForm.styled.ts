import styled from 'styled-components/macro';

export const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 24px 0 8px;
  flex: 1;

  > * + div {
    margin-top: 32px;
  }
`;

export const TitleWarning = styled.p`
  color: var(--warn);
`;