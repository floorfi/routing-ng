import { Injectable } from '@angular/core';
import {TravelConfig} from '../interfaces/travelConfig.interface';
import * as moment from 'moment-timezone';

@Injectable({
  providedIn: 'root'
})
export class TravelConfigService {

  config: TravelConfig = {
    start: moment(),
    label: 'Meine Reise',
    maxDrivingTime: 1653354000
  }

  constructor() { }

  saveConfig = (config: TravelConfig) => {
    this.config = config
  }

}
