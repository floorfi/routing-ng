import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Store } from "./store";
import { Observable } from "rxjs";
import {Step} from '../interfaces/step.interface';

const timeoutMS: number = 10000; // Nach 10 Sekunden gelten Daten als veraltet und werden beim nächsten Abruf neu geholt

export class StepState {
  steps: Step[] = [];
}
@Injectable({
  providedIn: 'root'
})
export class StepStore extends Store<StepState> {

  public readonly users$: Observable<Step[]> = this.state$.pipe(map(state => state.steps));
  private cacheTimeout: boolean = false;

  constructor(private userApi: UserAPIService) {
    super(new StepState());
  }

  public getUsers(force = false): Promise<Step[]> {
    return new Promise(resolve => {
      if(force || this.cacheTimeout || this.state.steps.length === 0) {
        this.cacheTimeout = false;
        this.userApi.getUsers().subscribe(steps => {
          setTimeout(() => {
            this.cacheTimeout = true;
          }, timeoutMS);

          this.setState({
            ...this.state,
            steps: steps,
          });

          resolve(this.state.steps);
        })
      } else {
        resolve(this.state.steps);
      }
    })
  }

  public getUserById(id: string): Promise<User> {
    return new Promise(resolve => {
      // User im store zu finden?
      let user = this.state.users.find(stateUser => stateUser.id === id);
      if(user) {
        resolve(user);
      }
      // Nicht im Store - via API suchen
      else {
        this.userApi.getUserById(id).subscribe(user => {
          this.state.users.push(user);
          this.setState({
            ...this.state,
            users: this.state.users,
          });

          resolve(user);
        })
      }
    })
  }

  public updateUser(user: User): Promise<User> {
    return new Promise(resolve => {
      // User via API updaten
      this.userApi.updateUser(user).subscribe(updatedUser => {
        // Ist User schon im Store?
        let user = this.state.users.find(stateUser => stateUser.id === updatedUser.id);
        // User ist im store -> aktualisieren
        if(user) {
          user = updatedUser;
        }
        // User ist nicht im store -> hinzufügen
        else {
          this.state.users.push(updatedUser);
          this.setState({
            ...this.state,
            users: this.state.users
          });
        }

        resolve(updatedUser);
      })
    })
  }

  public createUser(user: User): Promise<User> {
    return new Promise(resolve => {
      this.userApi.createUser(user).subscribe(createdUser => {
        this.state.users.push(createdUser);
        this.setState({
          ...this.state,
          users: this.state.users
        });

        resolve(user);
      })
    })
  }

  public deleteUser(user: User): Promise<User> {
    return new Promise(resolve => {

      // User via API löschen
      this.userApi.deleteUser(user).subscribe(() => {

        // User aus Store löschen
        this.state.users = this.state.users.filter(stateUser => stateUser.id !== user.id);
        this.setState({
          ...this.state
        });

        resolve(user);
      })
    })
  }
}
