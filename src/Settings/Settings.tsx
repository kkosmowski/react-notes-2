import { ReactElement, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import SettingsActions from '../store/actionCreators/settings.action-creators';
import { ErrorText, LeftSide, RightSide, Section, Subtitle, Wrapper } from './Settings.styled';
import { Button } from '../Button/Button';
import { Variant } from '../domain/enums/variant.enum';
import { ArrowBack as ArrowBackIcon, ArrowForward as ArrowForwardIcon } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import { selectAllSettings } from '../store/selectors/settings.selectors';
import { Color } from '../domain/enums/color.enum';
import { Select } from '../Select/Select';
import { Input } from '../Input/Input';
import { SettingsInterface } from '../domain/model/settings.model';
import {
  directions,
  languages,
  MAX_SNACKBAR_DURATION,
  MIN_SNACKBAR_DURATION,
  themes
} from '../domain/consts/settings.consts';
import { getDirectionLabel, getLanguageLabel, getThemeLabel } from './settings.utils';
import { getPluralizedSecondsUtil } from '../utils/get-pluralized-seconds.util';
import { RouterUtil } from '../domain/utils/router.util';

export const Settings = (): ReactElement => {
  const { t } = useTranslation('SETTINGS');
  const { theme, direction, language, snackbarDuration } = useSelector(selectAllSettings);
  const [form, setForm] = useState<SettingsInterface>({ theme, direction, language, snackbarDuration });
  const [touched, setTouched] = useState<Record<keyof SettingsInterface, boolean | null>>(
    { language: null, snackbarDuration: null, theme: null, direction: null }
  );
  const [durationError, setDurationError] = useState<string>('');
  const dispatch = useDispatch();
  const history = useHistory();
  const seconds = getPluralizedSecondsUtil(snackbarDuration);

  useEffect(() => {
    dispatch(SettingsActions.openSettings());

    return () => {
      dispatch(SettingsActions.closeSettings());
    };
  }, []);

  useEffect(() => {
    if (theme && direction && language && snackbarDuration) {
      let newValues: SettingsInterface = { theme, direction, language, snackbarDuration };

      for (const p in newValues) {
        const property = p as keyof SettingsInterface;

        if (touched[property]) {
          newValues = {
            ...newValues,
            [property]: form[property]
          };
        }
      }

      setForm(newValues);
    }
  }, [theme, direction, language, snackbarDuration]);

  const handleFormChange = (property: keyof SettingsInterface, value: string[] | number): void => {
    if (typeof value === 'number') {
      if (value < MIN_SNACKBAR_DURATION) {
        setDurationError('DURATION_TOO_SMALL');
      } else if (value > MAX_SNACKBAR_DURATION) {
        setDurationError('DURATION_TOO_LARGE');
      } else {
        setDurationError('');
      }
    }

    setForm({
      ...form,
      [property]: typeof value === 'number' ? value : value[0],
    });
    setTouched({ ...touched, [property]: true });
  };

  const handleThemeSave = (): void => {
    if (form.theme !== theme) {
      dispatch(SettingsActions.updateTheme(form.theme));
      setTouched({ ...touched, theme: false });
    }
  };

  const handleDirectionSave = (): void => {
    if (form.direction !== direction) {
      dispatch(SettingsActions.updateDirection(form.direction));
      setTouched({ ...touched, direction: false });
    }
  };

  const handleLanguageSave = (): void => {
    if (form.language !== language) {
      dispatch(SettingsActions.updateLanguage(form.language));
      setTouched({ ...touched, language: false });
    }
  };

  const handleSnackbarDurationSave = (): void => {
    if (form.snackbarDuration !== snackbarDuration) {
      dispatch(SettingsActions.updateSnackbarDuration(form.snackbarDuration));
      setTouched({ ...touched, snackbarDuration: false });
    }
  };

  const handleGoBack = (): void => {
    RouterUtil.back(history);
  };

  return (
    <Wrapper>
      <Button
        onClick={ handleGoBack }
        variant={ Variant.Regular }
      >
        { direction === 'ltr' ? <ArrowBackIcon /> : <ArrowForwardIcon /> }
        { t('GO_BACK') }
      </Button>

      <Section>
        <LeftSide>
          <Subtitle>{ t('THEME_TITLE') }</Subtitle>
          <p>{ t('CURRENT_THEME') } <strong>{ t(getThemeLabel(theme)) }</strong></p>
        </LeftSide>

        <RightSide>
          <Select
            options={ themes }
            initialValue={ theme }
            onChange={ (value) => handleFormChange('theme', value) }
          />
          <Button
            onClick={ handleThemeSave }
            color={ Color.Primary }
            variant={ Variant.Contained }
            disabled={ touched.theme !== true }
          >
            { t('CHANGE_THEME') }
          </Button>
        </RightSide>
      </Section>

      <Section>
        <LeftSide>
          <Subtitle>{ t('DIRECTION') }</Subtitle>
          <p>{ t('CURRENT_DIRECTION') } <strong>{ t(getDirectionLabel(direction)) }</strong></p>
        </LeftSide>

        <RightSide>
          <Select
            options={ directions }
            initialValue={ direction }
            onChange={ (value) => handleFormChange('direction', value) }
          />
          <Button
            onClick={ handleDirectionSave }
            color={ Color.Primary }
            variant={ Variant.Contained }
            disabled={ touched.direction !== true }
          >
            { t('CHANGE_DIRECTION') }
          </Button>
        </RightSide>
      </Section>

      <Section>
        <LeftSide>
          <Subtitle>{ t('LANGUAGE') }</Subtitle>
          <p>{ t('CURRENT_LANGUAGE') } <strong>{ t(getLanguageLabel(language)) }</strong></p>
        </LeftSide>

        <RightSide>
          <Select
            options={ languages }
            initialValue={ language }
            onChange={ (value) => handleFormChange('language', value) }
          />
          <Button
            onClick={ handleLanguageSave }
            color={ Color.Primary }
            variant={ Variant.Contained }
            disabled={ touched.language !== true }
          >
            { t('CHANGE_LANGUAGE') }
          </Button>
        </RightSide>
      </Section>

      <Section>
        <LeftSide>
          <Subtitle>{ t('SNACKBAR_DURATION') } </Subtitle>
          <p>{ t('CURRENT_SNACKBAR_DURATION') } <strong>{ snackbarDuration } { t(seconds) }</strong></p>
          { durationError && (
            <ErrorText>{ t(durationError, {
              min: MIN_SNACKBAR_DURATION,
              max: MAX_SNACKBAR_DURATION,
            }) }</ErrorText>
          ) }
        </LeftSide>

        <RightSide>
          <Input
            id="snackbarDuration"
            type="number"
            step={ 0.1 }
            value={ form.snackbarDuration }
            onChange={ e => handleFormChange('snackbarDuration', +e.target.value) }
            style={{ width: '120px' }}
          />
          <Button
            onClick={ handleSnackbarDurationSave }
            color={ Color.Primary }
            variant={ Variant.Contained }
            disabled={ touched.snackbarDuration !== true || !!durationError }
          >
            { t('CHANGE_SNACKBAR_DURATION') }
          </Button>
        </RightSide>
      </Section>

    </Wrapper>
  );
};
