import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  onClick: () => void;
}

export const AddNoteButton = ({ onClick }: Props): ReactElement => {
  const { t } = useTranslation('MAIN');

  return (
    <button
      onClick={ onClick }
      className="button --regular --primary"
      type="button"
    >
      { t('ADD_NOTE') }
    </button>
  );
};