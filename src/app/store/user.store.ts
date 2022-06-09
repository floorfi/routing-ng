import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Store } from "./store";
import { Observable } from "rxjs";

const timeoutMS: number = 10000; // Nach 10 Sekunden gelten Daten als veraltet und werden beim nächsten Abruf neu geholt

export class UserState {
  users: User[] = [];
}
@Injectable({
  providedIn: 'root'
})
export class UserStore extends Store<UserState> {

  public readonly users$: Observable<User[]> = this.state$.pipe(map(state => state.users));
  private cacheTimeout: boolean = false;

  constructor(private userApi: UserAPIService) {
    super(new UserState());
  }

  public getUsers(force = false): Promise<User[]> {
    return new Promise(resolve => {
      if(force || this.cacheTimeout || this.state.users.length === 0) {
        this.cacheTimeout = false;
        this.userApi.getUsers().subscribe(users => {
          setTimeout(() => {
            this.cacheTimeout = true;
          }, timeoutMS);

          this.setState({
            ...this.state,
            users: users,
          });

          resolve(this.state.users);
        })
      } else {
        resolve(this.state.users);
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
