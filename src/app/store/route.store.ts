import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Store } from "./store";
import {BehaviorSubject, Observable} from 'rxjs';
import {RouteApiService} from '../api/route.api.service';
import {Route} from '../classes/route.class';
import {Location} from '../classes/location.class';

const timeoutMS: number = 10000; // Nach 10 Sekunden gelten Daten als veraltet und werden beim nächsten Abruf neu geholt

export class RouteState {
  routes: Route[] = [];
}
@Injectable({
  providedIn: 'root'
})
export class RouteStore {

  static instance: RouteStore

  public routes$ = new BehaviorSubject<Route[]>([]);
  private cacheTimeout: boolean = false;

  constructor(private routeApiService: RouteApiService) {
    RouteStore.instance = this

    this.routes$.subscribe(e => {
      console.group('Route Store')
      console.log(e)
      console.groupEnd()
    })
  }

  // public getUsers(force = false): Promise<Route[]> {
  //   return new Promise(resolve => {
  //     if(force || this.cacheTimeout || this.state.routes.length === 0) {
  //       this.cacheTimeout = false;
  //       this.userApi.getUsers().subscribe(routes => {
  //         setTimeout(() => {
  //           this.cacheTimeout = true;
  //         }, timeoutMS);
  //
  //         this.setState({
  //           ...this.state,
  //           routes: routes,
  //         });
  //
  //         resolve(this.state.routes);
  //       })
  //     } else {
  //       resolve(this.state.routes);
  //     }
  //   })
  // }
  //
  public getRouteById(id: string): Route|undefined {
    return this.routes$.value.find(stateRoute => stateRoute.id === id);
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

  public createRoute(route: Route): Promise<Route> {
    return new Promise(resolve => {
      this.routeApiService.createRoute(route).subscribe(createdRoute => {    console.log('save route')
        const newState = this.routes$.value
        newState.push(createdRoute)
        this.routes$.next(newState);
        resolve(route);
      })
    })
  }

  public deleteRoute(route: Route): Promise<Route> {
    return new Promise(resolve => {
      this.routeApiService.deleteRoute(route).subscribe(() => {
        const newState = this.routes$.value.filter(stateRoute => stateRoute.id !== route.id);
        this.routes$.next(newState);

        resolve(route);
      })
    })
  }
}
