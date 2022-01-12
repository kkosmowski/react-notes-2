import { ReactElement } from 'react';
import { DateUtil } from '../domain/utils/date.util';
import { NoteInterface } from '../domain/interfaces/note.interface';
import { NoteDetailsContainer } from './NoteDetails.styled';
import { useTranslation } from 'react-i18next';

interface Props {
  note: NoteInterface;
}

export const NoteDetails = ({ note }: Props): ReactElement => {
  const { t } = useTranslation('NOTE_DIALOG');

  return (
    <NoteDetailsContainer>
      <span>{ t('CREATED_AT') } { DateUtil.format(note.createdAt) }</span>
      { note.updatedAt && (
        <span>{ t('UPDATED_AT') } { DateUtil.format(note.updatedAt) }</span>
      ) }
      { note.archivedAt && (
        <span>{ t('ARCHIVED_AT') } { DateUtil.format(note.archivedAt) }</span>
      ) }
    </NoteDetailsContainer>
  );
};
