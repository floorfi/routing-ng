import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {Step} from '../classes/step.class';

@Injectable({
  providedIn: 'root'
})
export class StepApiService {

  constructor(
    private httpClient: HttpClient
    ) { }

  userUrl: string = environment.apiPath + 'user'

  // getUsers(): Observable<Step[]> {
  //   return this.httpClient.get<Step[]>(this.userUrl);
  // }
  //
  // getUserById(id: string): Observable<Step> {
  //   return this.httpClient.get<Step>(this.userUrl + '/' + id);
  // }

  createStep(step: Step): Observable<Step> {
    return new Observable<Step>(subscriber => subscriber.next(step));
    // return this.httpClient.post<Step>(this.userUrl, step);
  }

  updateStep(step: Step): Observable<Step> {
    return new Observable<Step>(subscriber => subscriber.next(step));
    // return this.httpClient.post<Step>(this.userUrl, step);
  }

  deleteStep(step: Step): Observable<Step> {
    return new Observable<Step>(subscriber => subscriber.next(step));
    // return this.httpClient.delete<Step>(this.userUrl + '/' + step.id);
  }
}
