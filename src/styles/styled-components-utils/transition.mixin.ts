const addDelayIfDefined = (partial: string, delay: (string | null) | (string | null)[], i: number): string => {
  const _delay = Array.isArray(delay) ? delay[i] : delay;
  return _delay ? partial + ' ' + _delay : partial;
};

const addTimeOrTimingFn = (partial: string, value: string | string[], i: number): string => {
  return partial + ' ' + (Array.isArray(value) ? value[i] : value);
};

export const transition = (
  property: string | string[],
  time: string | string[],
  delay: (string | null) | (string | null)[] = '',
  timingFn: string | string[] = 'ease-in-out'
): string => {
  let transitionValue: string;
  let willChangeValue: string;

  if (Array.isArray(property)) {
    const transitionValues: string[] = [];
    const willChangeValues: string[] = [];

    for (let i = 0; i < property.length; i++) {
      let partial = '';
      partial = addTimeOrTimingFn(partial, time, i);
      partial += ' ' + property[i];
      partial = addDelayIfDefined(partial, delay, i);
      partial = addTimeOrTimingFn(partial, timingFn, i);
      transitionValues.push(partial);
      willChangeValues.push(property[i]);
    }

    transitionValue = transitionValues.join(', ');
    willChangeValue = willChangeValues.join(', ');

  } else {
    transitionValue = `${ time } ${ property } ${ delay } ${ timingFn }`;
    willChangeValue = property;
  }

  return `
    transition: ${ transitionValue };
    will-change: ${ willChangeValue };
  `;
};