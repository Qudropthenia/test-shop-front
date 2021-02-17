import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { AppConfig } from './app.config';
import { Observable, throwError } from 'rxjs/index';
import { catchError } from 'rxjs/internal/operators';

@Injectable()
export class ApiService {

  constructor(private http: HttpClient, private config: AppConfig) {
  }

  /**
   * Формирование URL к обработчику контроллера
   * @param path - путь, относительно сервера
   * @returns {string} - полный путь
   */
  private getURL(path: string): string {
    return `${this.config.apiEndpoint}${path}`;
  }

  /**
   * Костыльная сборка Options для выбора "responseType", т.к. согласно документации:
   * http.get('/foo', {responseType: 'text'}) // this works
   * // but this does NOT work
   * const options = { responseType: 'text' };
   * http.get('/foo', options)
   * @param httpParams - HttpParams, как это не странно
   * @param respType - 'text' | 'json'
   * @returns {({responseType: string}|{responseType: string})&({params: HttpParams}|{})}
   */
  private getOptions(httpParams?: HttpParams, respType?: 'text' | 'json'): {} {
    const responseType = (respType === 'json') ?
        { responseType: 'json' } :
        { responseType: 'text' };
    const params = (httpParams) ?
        { params: httpParams } :
        {};

    return Object.assign(responseType, params);
  }

  /**
   * Не используется, но для примера добавил
   * @param error - ошибка при получении ответа
   * @returns {Observable<never>}
   */
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError('Something bad happened; please try again later.');
  }

  /**
   * Формирование GET запросов
   * @param path - путь к контроллеру относительно адреса сервера
   * @param httpParams - список параметров запросов (head)
   * @param respType - тип ответа 'text' | 'json'
   * @returns {Observable<ObservedValueOf<Observable<never>>|any>}
   */
  public get(path: string, httpParams?: HttpParams, respType: 'text' | 'json' = 'json') {
    const url: string = this.getURL(path);
    const options = this.getOptions(httpParams, respType);

    return this.http.get(url, options)
      .pipe(catchError((error, caught) => this.handleError(error)));
  }

  public post(path: string, body?: object, httpParams?: HttpParams, respType: 'text' | 'json' = 'json') {
    const url: string = this.getURL(path);
    const options = this.getOptions(httpParams, respType);

    return this.http.post(url, body, options)
      .pipe(catchError((error, caught) => this.handleError(error)));
  }
}
