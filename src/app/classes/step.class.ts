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

    console.log('Next orderId: ' + this.nextOrderID);

    this.id = id;
    this.label = label;
    this.nights = 0;
    this.orderId = this.nextOrderID;
  }

  get nextOrderID(): number {
    if (StepStore.instance.steps$.value.length === 0) return 0;
    return StepStore.instance.steps$.value.reduce((prev, curr) => prev.orderId < curr.orderId ? curr : prev).orderId + 1;
  }

  get previousStep(): Step | null {
    if (StepStore.instance.steps$.value.length === 0) return null;
    return StepStore.instance.steps$.value.find(step => step.orderId === this.orderId - 1)!;
  }

  get followingStep(): Step | null {
    const followingStep = StepStore.instance.steps$.value.find(step => step.orderId === this.orderId + 1);
    return followingStep ? followingStep : null;
  }

  save = (): void => {
    if (StepStore.instance.getStepById(this.id)) {
      StepStore.instance.updateStep(this);
    } else {
      StepStore.instance.createStep(this);
    }
  };

  delete = (): void => {
    StepStore.instance.createStep(this);
  };
}
