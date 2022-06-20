import {Injectable} from "@angular/core";
import {BehaviorSubject} from 'rxjs';
import {RouteApiService} from '../api/route.api.service';
import {Route} from '../classes/route.class';

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
  public getRouteById(id: string): Route | undefined {
    let route = this.routes$.value.find(stateRoute => stateRoute.id === id);
    if (route) route = Object.create(route);

    return route;
  }


  public updateRoute(route: Route): Promise<Route> {
    return new Promise(resolve => {

      this.routeApiService.updateRoute(route).subscribe(updatedRoute => {
        const route = this.routes$.value.find(stateRoute => stateRoute.id === updatedRoute.id)!;
        const index = this.routes$.value.indexOf(route);

        const newState = this.routes$.value;
        newState[index] = updatedRoute;

        this.routes$.next(newState);

        resolve(updatedRoute);
      });
    });
  }


  public createRoute(route: Route): Promise<Route> {
    return new Promise(resolve => {
      this.routeApiService.createRoute(route).subscribe(createdRoute => {
        console.log('save route');
        const newState = this.routes$.value;
        newState.push(createdRoute);
        this.routes$.next(newState);
        resolve(route);
      });
    });
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
