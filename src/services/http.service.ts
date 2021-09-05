interface HttpHeaders {
  [key: string]: string;
}

export class HttpService {
  private static readonly apiUrl: string = process.env.REACT_APP_API_URL!;
  private static readonly headers: HttpHeaders = {
    'Content-Type': 'application/json',
  };

  private static json = (response: Response) => response.json();

  static get(url: string): Promise<any> {
    return fetch(this.apiUrl + url, {
      method: 'GET',
      headers: this.headers
    }).then(this.json);
  }

  static post<T>(url: string, body: T): Promise<any> {
    return fetch(this.apiUrl + url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: this.headers
    }).then(this.json);
  }

  static put<T>(url: string, body: T): Promise<any> {
    return fetch(this.apiUrl + url, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: this.headers
    }).then(this.json);
  }

  static delete(url: string): Promise<any> {
    return fetch(this.apiUrl + url, {
      method: 'DELETE',
      headers: this.headers
    }).then(this.json);
  }
}
