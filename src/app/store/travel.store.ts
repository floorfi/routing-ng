import {Injectable} from "@angular/core";
import {BehaviorSubject} from 'rxjs';
import {TravelApiService} from '../api/travel.api.service';
import {Travel} from '../classes/travel.class';

const timeoutMS: number = 10000; // Nach 10 Sekunden gelten Daten als veraltet und werden beim nächsten Abruf neu geholt

export class TravelState {
  travels: Travel[] = [];
}

@Injectable({
  providedIn: 'root'
})
export class TravelStore {

  static instance: TravelStore;

  public currentTravel?: Travel;

  public travels$ = new BehaviorSubject<Travel[]>([]);
  private cacheTimeout: boolean = false;

  constructor(private travelApiService: TravelApiService) {
    TravelStore.instance = this;

    this.travels$.subscribe(e => {
      console.group('Travel Store');
      console.log(e);
      console.groupEnd();
    });
  }

  // public getTravels(force = false): Promise<Travel[]> {
  //   return new Promise(resolve => {
  //     if(force || this.cacheTimeout || this.state.travels.length === 0) {
  //       this.cacheTimeout = false;
  //       this.travelApi.getTravels().subscribe(travels => {
  //         setTimeout(() => {
  //           this.cacheTimeout = true;
  //         }, timeoutMS);
  //
  //         this.setState({
  //           ...this.state,
  //           travels: travels,
  //         });
  //
  //         resolve(this.state.travels);
  //       })
  //     } else {
  //       resolve(this.state.travels);
  //     }
  //   })
  // }
  //
  public getTravelById(id: string): Travel | undefined {
    let travel = this.travels$.getValue().find(stateTravel => stateTravel.id === id);
    if (travel) travel = {...travel};

    return travel;
  }

  public updateTravel(travel: Travel): Promise<Travel> {
    return new Promise(resolve => {

      this.travelApiService.updateTravel(travel).subscribe(updatedTravel => {
        const travel = this.travels$.value.find(stateTravel => stateTravel.id === updatedTravel.id)!;
        const index = this.travels$.value.indexOf(travel);

        const newState = this.travels$.value;
        newState[index] = updatedTravel;

        this.travels$.next(newState);

        resolve(updatedTravel);
      });
    });
  }

  public createTravel(travel: Travel): Promise<Travel> {
    return new Promise(resolve => {
      this.travelApiService.createTravel(travel).subscribe(createdTravel => {
        const newState = this.travels$.value;
        newState.push(createdTravel);
        this.travels$.next(newState);
        resolve(travel);
      });
    });
  }

  public deleteTravel(travel: Travel): Promise<Travel> {
    return new Promise(resolve => {
      this.travelApiService.deleteTravel(travel).subscribe(() => {
        const newState = this.travels$.value.filter(stateTravel => stateTravel.id !== travel.id);
        this.travels$.next(newState);

        resolve(travel);
      });
    });
  }
}
