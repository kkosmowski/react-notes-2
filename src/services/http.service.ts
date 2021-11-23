interface HttpHeaders {
  [key: string]: string;
}

export class HttpService {
  private static readonly apiUrl: string = process.env.REACT_APP_API_URL!;
  private static readonly headers: HttpHeaders = {
    'Content-Type': 'application/json',
  };

  static get<R>(url: string): Promise<R> {
    return fetch(this.apiUrl + url, {
      method: 'GET',
      headers: this.headers
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error();
    });
  }

  static post<B, R>(url: string, body: B): Promise<R> {
    return fetch(this.apiUrl + url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: this.headers
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error();
    });
  }

  static put<B, R>(url: string, body: B): Promise<R> {
    return fetch(this.apiUrl + url, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: this.headers
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error();
    });
  }

  static patch<B, R>(url: string, body: B): Promise<R> {
    return fetch(this.apiUrl + url, {
      method: 'PATCH',
      body: JSON.stringify(body),
      headers: this.headers
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error();
    });
  }

  static delete<R>(url: string): Promise<R> {
    return fetch(this.apiUrl + url, {
      method: 'DELETE',
      headers: this.headers
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error();
    });
  }
}
