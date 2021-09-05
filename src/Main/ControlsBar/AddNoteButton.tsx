import { ReactElement } from 'react';

interface Props {
  onClick: () => void;
}

export const AddNoteButton = ({ onClick }: Props): ReactElement => {
  return (
    <button
      onClick={ onClick }
      className="button --regular --primary"
      type="button"
    >
      Add note
    </button>
  );
};