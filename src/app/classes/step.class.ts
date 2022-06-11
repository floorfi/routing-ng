import {StepStore} from '../store/step.store';

export class Step {

  id: string;
  label: string;
  nights: number;
  orderId: number;

  constructor(
    id: string,
    label: string
  ) {

    console.log('Next orderId: ' + this.getNextOrderID())

    this.id = id,
    this.label = label,
    this.nights = 0,
    this.orderId = this.getNextOrderID()
  }

  getNextOrderID = (): number => {
    if(StepStore.instance.steps$.value.length === 0) return 0
    return StepStore.instance.steps$.value.reduce((prev, curr) => prev.orderId < curr.orderId ? prev : curr).orderId + 1;
  }

  getPreviousStep = (): Step|null => {
    if(StepStore.instance.steps$.value.length === 0) return null
    return StepStore.instance.steps$.value[StepStore.instance.steps$.value.length - 1];
  }

  save = (): void => {
    StepStore.instance.createStep(this);
  }


}
