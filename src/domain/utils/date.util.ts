export class DateUtil {
  static format(isoString: string): string {
    const date = new Date(isoString);
    const addZero = (s: number): string => String(s).padStart(2, '0');
    const DD = addZero(date.getDate());
    const MM = addZero(date.getMonth());
    const YYYY = addZero(date.getFullYear());
    const HH = addZero(date.getHours());
    const mm = addZero(date.getMinutes());

    return `${ DD }.${ MM }.${ YYYY }, ${ HH }:${ mm }`;
  }
}
