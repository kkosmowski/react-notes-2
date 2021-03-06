import { History } from 'history';

interface RouterUtilOptions {
  customPrevious?: string;
  dontCompareWithPrevious?: boolean;
  keepPrevious?: boolean;
}

interface HistoryState {
  previous?: string;
}

export class RouterUtil {
  static push(path: string, history: History, options?: RouterUtilOptions): void {
    if (options?.customPrevious && options.keepPrevious) {
      throw new Error('Please specify either customPrevious or keepPrevious.');
    }

    const pathname = options?.dontCompareWithPrevious ? path : this.getPathname(path, history);
    const previous = options?.keepPrevious
      ? (history.location.state as HistoryState)?.previous || '/'
      : options?.customPrevious || this.getPrevious(path, history);

    history.push({ pathname }, { previous });
  }

  static back(history: History, options?: RouterUtilOptions): void {
    const path = !history.location.state
      ? '/'
      : (history.location.state as HistoryState)?.previous || '/';

    this.push(path, history, {
      dontCompareWithPrevious: true,
      ...options
    });
  }

  private static getPathname(path: string, history: History): string {
    return !history.location.state
      ? path
      : (history.location.state as HistoryState)?.previous === path
        ? '/'
        : path;
  }

  private static getPrevious(path: string, history: History): string {
    return history.location.pathname === path
      ? (history.location.state as HistoryState)?.previous || '/'
      : history.location.pathname;
  }
}