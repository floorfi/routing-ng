import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {Location} from '../classes/location.class';

@Injectable({
  providedIn: 'root'
})
export class LocationApiService {

  constructor(
    private httpClient: HttpClient
    ) { }

  userUrl: string = environment.apiPath + 'user'

  // getUsers(): Observable<Location[]> {
  //   return this.httpClient.get<Location[]>(this.userUrl);
  // }
  //
  // getUserById(id: string): Observable<Location> {
  //   return this.httpClient.get<Location>(this.userUrl + '/' + id);
  // }

  createLocation(location: Location): Observable<Location> {
    return new Observable<Location>(subscriber => subscriber.next(location))
    // return this.httpClient.post<Location>(this.userUrl, location);
  }

  // updateUser(location: Location): Observable<Location> {
  //   return this.httpClient.put<Location>(this.userUrl + '/' + location.id, location);
  // }

  deleteLocation(location: Location): Observable<Location> {
    return new Observable<Location>(subscriber => subscriber.next(location))
    // return this.httpClient.delete<Location>(this.userUrl + '/' + location.id);
  }
}
