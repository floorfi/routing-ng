import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Store } from "./store";
import {BehaviorSubject, Observable} from 'rxjs';
import {StepApiService} from '../api/step.api.service';
import {Step} from '../classes/step.class';

const timeoutMS: number = 10000; // Nach 10 Sekunden gelten Daten als veraltet und werden beim nächsten Abruf neu geholt

export class StepState {
  steps: Step[] = [];
}
@Injectable({
  providedIn: 'root'
})
export class StepStore {

  static instance: StepStore

  public steps$ = new BehaviorSubject<Step[]>([]);
  private cacheTimeout: boolean = false;

  constructor(private stepApiService: StepApiService) {
    StepStore.instance = this

    this.steps$.subscribe(e => {
      console.group('Step Store')
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
  // public getUserById(id: string): Promise<User> {
  //   return new Promise(resolve => {
  //     // User im store zu finden?
  //     let user = this.state.users.find(stateUser => stateUser.id === id);
  //     if(user) {
  //       resolve(user);
  //     }
  //     // Nicht im Store - via API suchen
  //     else {
  //       this.userApi.getUserById(id).subscribe(user => {
  //         this.state.users.push(user);
  //         this.setState({
  //           ...this.state,
  //           users: this.state.users,
  //         });
  //
  //         resolve(user);
  //       })
  //     }
  //   })
  // }
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

  public createStep(step: Step): Promise<Step> {
    return new Promise(resolve => {
      this.stepApiService.createStep(step).subscribe(createdStep => {
        const newState = this.steps$.value
        newState.push(createdStep)
        this.steps$.next(newState);
        resolve(step);
      })
    })
  }

  public deleteStep(step: Step): Promise<Step> {
    return new Promise(resolve => {
      this.stepApiService.deleteStep(step).subscribe(() => {
        const newState = this.steps$.value.filter(stateStep => stateStep.id !== step.id);
        this.steps$.next(newState);

        resolve(step);
      })
    })
  }
}
