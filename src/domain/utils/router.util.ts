import { History } from 'history';

interface RouterUtilOptions {
  customPrevious?: string;
  dontCompareWithPrevious?: boolean;
  keepPrevious?: boolean;
}

export class RouterUtil {
  static push(path: string, history: History<{ previous: string }>, options?: RouterUtilOptions): void {
    if (options?.customPrevious && options.keepPrevious) {
      throw new Error('Please specify either customPrevious or keepPrevious.');
    }

    const pathname = options?.dontCompareWithPrevious ? path : this.getPathname(path, history);
    const previous = options?.keepPrevious
      ? history.location.state?.previous || '/'
      : options?.customPrevious || this.getPrevious(path, history);

    history.push({ pathname }, { previous });
  }

  static back(history: History<{ previous: string }>, options?: RouterUtilOptions): void {
    const path = !history.location.state
      ? '/'
      : history.location.state.previous;

    this.push(path, history, {
      dontCompareWithPrevious: true,
      ...options
    });
  }

  private static getPathname(path: string, history: History<{ previous: string }>): string {
    return !history.location.state
      ? path
      : history.location.state.previous === path
        ? '/'
        : path;
  }

  private static getPrevious(path: string, history: History<{ previous: string }>): string {
    return history.location.pathname === path
      ? history.location.state?.previous || '/'
      : history.location.pathname;
  }
}