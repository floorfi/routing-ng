import {Injectable} from "@angular/core";
import {BehaviorSubject} from 'rxjs';
import {LocationApiService} from '../api/location.api.service';
import {Location} from '../classes/location.class';

const timeoutMS: number = 10000; // Nach 10 Sekunden gelten Daten als veraltet und werden beim nächsten Abruf neu geholt

export class LocationState {
  locations: Location[] = [];
}

@Injectable({
  providedIn: 'root'
})
export class LocationStore {

  static instance: LocationStore

  public locations$ = new BehaviorSubject<Location[]>([]);
  private cacheTimeout: boolean = false;

  constructor(private locationApiService: LocationApiService) {
    LocationStore.instance = this

    this.locations$.subscribe(e => {
      console.group('Location Store')
      console.log(e)
      console.groupEnd()
    })
  }

  // public getUsers(force = false): Promise<Step[]> {
  //   return new Promise(resolve => {
  //     if(force || this.cacheTimeout || this.state.steps.length === 0) {
  //       this.cacheTimeout = false;
  //       this.userApi.getUsers().subscribe(steps => {
  //         setTimeout(() => {
  //           this.cacheTimeout = true;
  //         }, timeoutMS);
  //
  //         this.setState({
  //           ...this.state,
  //           steps: steps,
  //         });
  //
  //         resolve(this.state.steps);
  //       })
  //     } else {
  //       resolve(this.state.steps);
  //     }
  //   })
  // }
  //
  public getLocationById(id: string): Location | undefined {
    let location = this.locations$.getValue().find(stateLocation => stateLocation.id === id);
    if (location) location = Object.create(location);

    return location;
  }


  public updateLocation(location: Location): Promise<Location> {
    return new Promise(resolve => {

      this.locationApiService.updateLocation(location).subscribe(updatedLocation => {
        const location = this.locations$.value.find(stateLocation => stateLocation.id === updatedLocation.id)!;
        const index = this.locations$.value.indexOf(location);

        const newState = this.locations$.value;
        newState[index] = updatedLocation;

        this.locations$.next(newState);

        resolve(updatedLocation);
      });
    });
  }


  public createLocation(location: Location): Promise<Location> {
    return new Promise(resolve => {
      this.locationApiService.createLocation(location).subscribe(createdLocation => {
        const newState = this.locations$.value;
        newState.push(createdLocation);
        this.locations$.next(newState);
        resolve(location);
      });
    })
  }

  public deleteLocation(location: Location): Promise<Location> {
    return new Promise(resolve => {
      this.locationApiService.deleteLocation(location).subscribe(() => {
        const newState = this.locations$.value.filter(stateLocation => stateLocation.id !== location.id);
        this.locations$.next(newState);

        resolve(location);
      })
    })
  }
}
