import {Duration, Moment} from 'moment';
import * as moment from 'moment-timezone';

export class Travel {

  id?: string;
  label: string;
  start: Moment;
  maxDrivingTime: Duration;

  constructor(
    label: string
  ) {
    this.id = 'black'; // TODO
    this.label = label;
    this.start = moment();
    this.maxDrivingTime = moment.duration('3:01');
    console.log(this);
  }

}
