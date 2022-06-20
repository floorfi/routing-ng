import {Injectable} from "@angular/core";
import {BehaviorSubject} from 'rxjs';
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
  public getStepById(id: string): Step | undefined {
    let step = this.steps$.value.find(stateStep => stateStep.id === id);
    if (step) step = Object.create(step);

    return step;
  }


  public updateStep(step: Step): Promise<Step> {
    return new Promise(resolve => {

      this.stepApiService.updateStep(step).subscribe(updatedStep => {
        const step = this.steps$.value.find(stateStep => stateStep.id === updatedStep.id)!;
        const index = this.steps$.value.indexOf(step);

        const newState = this.steps$.value;
        newState[index] = updatedStep;

        this.steps$.next(newState);

        resolve(updatedStep);
      });
    });
  }


  public createStep(step: Step): Promise<Step> {
    return new Promise(resolve => {
      this.stepApiService.createStep(step).subscribe(createdStep => {
        const newState = this.steps$.value;
        newState.push(createdStep);
        this.steps$.next(newState);
        resolve(step);
      });
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
