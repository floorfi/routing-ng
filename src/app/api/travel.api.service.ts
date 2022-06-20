import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {Travel} from '../classes/travel.class';

@Injectable({
  providedIn: 'root'
})
export class TravelApiService {

  travelUrl: string = environment.apiPath + 'travel';

  constructor(
    private httpClient: HttpClient
  ) {
  }

  // getTravels(): Observable<Travel[]> {
  //   return this.httpClient.get<Travel[]>(this.travelUrl);
  // }
  //
  // getTravelById(id: string): Observable<Travel> {
  //   return this.httpClient.get<Travel>(this.travelUrl + '/' + id);
  // }

  createTravel(travel: Travel): Observable<Travel> {
    return new Observable<Travel>(subscriber => subscriber.next(travel));
    // return this.httpClient.post<Travel>(this.travelUrl, travel);
  }

  updateTravel(travel: Travel): Observable<Travel> {
    console.log(travel);

    return new Observable<Travel>(subscriber => subscriber.next(travel));
    // return this.httpClient.put<Travel>(this.travelUrl + '/' + travel.id, travel);
  }

  deleteTravel(travel: Travel): Observable<Travel> {
    return new Observable<Travel>(subscriber => subscriber.next(travel));
    // return this.httpClient.delete<Travel>(this.travelUrl + '/' + travel.id);
  }
}
