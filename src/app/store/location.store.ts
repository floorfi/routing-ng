import { Injectable } from "@angular/core";
import {BehaviorSubject, Observable} from 'rxjs';
import {Step} from '../classes/step.class';
import {Location} from '../classes/location.class';
import {LocationApiService} from '../api/location.api.service';

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
  public getLocationById(id: string): Location|undefined {
      return this.locations$.value.find(stateLocation => stateLocation.id === id);
  }
  //
  // public updateUser(user: User): Promise<User> {
  //   return new Promise(resolve => {
  //     // User via API updaten
  //     this.userApi.updateUser(user).subscribe(updatedUser => {
  //       // Ist User schon im Store?
  //       let user = this.state.users.find(stateUser => stateUser.id === updatedUser.id);
  //       // User ist im store -> aktualisieren
  //       if(user) {
  //         user = updatedUser;
  //       }
  //       // User ist nicht im store -> hinzufügen
  //       else {
  //         this.state.users.push(updatedUser);
  //         this.setState({
  //           ...this.state,
  //           users: this.state.users
  //         });
  //       }
  //
  //       resolve(updatedUser);
  //     })
  //   })
  // }

  public createLocation(location: Location): Promise<Location> {
    return new Promise(resolve => {
      this.locationApiService.createLocation(location).subscribe(createdLocation => {
        const newState = this.locations$.value
        newState.push(createdLocation)
        this.locations$.next(newState);
        resolve(location);
      })
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
