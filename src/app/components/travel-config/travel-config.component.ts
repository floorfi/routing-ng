import { Component, OnInit } from '@angular/core';
import {TravelConfigService} from '../../services/travelConfig.service';
import {TravelConfig} from '../../interfaces/travelConfig.interface';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-travel-config',
  templateUrl: './travel-config.component.html',
  styleUrls: ['./travel-config.component.scss']
})
export class TravelConfigComponent implements OnInit {

  travelConfig: TravelConfig;

  constructor(
    private travelConfigService: TravelConfigService
  ) {
    this.travelConfig = travelConfigService.config
  }

  ngOnInit(): void {
  }

  save = () => {
    console.log('save')

    const configToSave = {...this.travelConfigService.config}
    configToSave.label = this.travelConfig.label
    // configToSave.maxDrivingTime = moment(this.travelConfig.maxDrivingTime, 'HH:mm').format('X')
    // configToSave.start = moment(this.travelConfig.start, 'YYYY-MM-DDTHH:mm').tz(moment.tz.guess())
    // travelConfigService.saveConfig(configToSave)
    // modalOpen.value = false
  }

}
