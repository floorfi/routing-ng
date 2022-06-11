import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {Route} from '../classes/route.class';

@Injectable({
  providedIn: 'root'
})
export class RouteApiService {

  constructor(
    private httpClient: HttpClient
    ) { }

  routeUrl: string = environment.apiPath + 'route'

  // getRoutes(): Observable<Route[]> {
  //   return this.httpClient.get<Route[]>(this.routeUrl);
  // }
  //
  // getRouteById(id: string): Observable<Route> {
  //   return this.httpClient.get<Route>(this.routeUrl + '/' + id);
  // }

  createRoute(route: Route): Observable<Route> {
    return new Observable<Route>(subscriber => subscriber.next(route))
    // return this.httpClient.post<Route>(this.routeUrl, route);
  }

  // updateRoute(route: Route): Observable<Route> {
  //   return this.httpClient.put<Route>(this.routeUrl + '/' + route.id, route);
  // }

  deleteRoute(route: Route): Observable<Route> {
    return new Observable<Route>(subscriber => subscriber.next(route))
    // return this.httpClient.delete<Route>(this.routeUrl + '/' + route.id);
  }
}
