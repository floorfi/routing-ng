import {Duration, Moment} from 'moment';
import * as moment from 'moment-timezone';

export class Travel {

  id?: string;
  label: string;
  start: Moment;
  maxDrivingTime: Duration;
  standardLocationDuration: Duration;
  standardDayBegin: string;
  standardDayEnd: string;

  constructor(
    label: string
  ) {
    this.id = 'black'; // TODO
    this.label = label;
    this.start = moment();
    this.maxDrivingTime = moment.duration('3:00');
    this.standardLocationDuration = moment.duration('3:00'); // TODO
    this.standardDayBegin = '06:00';
    this.standardDayEnd = '18:00';
    console.log(this);
  }

}
