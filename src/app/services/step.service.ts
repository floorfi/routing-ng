import { Injectable } from '@angular/core';
import {MapboxLocation} from '../interfaces/mapbox-location.interface';
import {Step} from '../interfaces/step.interface';

@Injectable({
  providedIn: 'root'
})
export class StepService {

  steps: Step[] = [];

  constructor() { }

  addStep = (step: Step) => {
    this.steps.push(step)
  }

  updateStep = (step: Step) => {
    let stepToUpdate = this.steps.find(stateStep => stateStep.id === step.id)
    stepToUpdate = step
  }

  removeStep = (id: string) => {
    this.steps = this.steps.filter((step: Step) => {
      return step.id !== id
    })
  }

  reindex = () => {
    this.steps.filter((step: Step) => step)
  }

}
