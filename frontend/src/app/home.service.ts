import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const api_url = "http://localhost:8080";

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  userData: any;

  constructor(
    private httpService: HttpClient,
  ) { }

  private _cartRefresh = new Subject<any>();

  getCartRefresh() {
    return this._cartRefresh;
  }

  getLoggedInUser() {
    return this.userData;
  }

  register(item: any): Observable<any> {
    let url = `${api_url}/register`
    return this.httpService.post<any>(url, item).pipe(
      map(data => {
        return data;
      }),
      catchError(() => throwError('Unable to Authorize!'))
    );
  }

  login(item: any): Observable<any> {
    let url = `${api_url}/login`
    return this.httpService.post<any>(url, item).pipe(
      map(data => {
        this.userData = data;
        return data;
      }),
      catchError(() => throwError('Unable to Authorize!'))
    );
  }

  getDishes(): Observable<any> {
    let url = `${api_url}/dishes`

    return this.httpService.get<any>(url).pipe(
      map(data => {
        return data;
      }),
      catchError(() => throwError('Dishes not found!'))
    );
  }

  addToCart(item: any) {
    let dishes = [];
    if (localStorage.getItem('items')) {
      dishes = JSON.parse(localStorage.getItem('items')!);
    }
    dishes.push(item);
    localStorage.setItem('items', JSON.stringify(dishes));
    this._cartRefresh.next(item);
  }

  getCartData() {
    let cartData = JSON.parse(localStorage.getItem('items')!);
    return cartData;
  }

}
