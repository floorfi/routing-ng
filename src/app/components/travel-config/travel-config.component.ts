import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-travel-config',
  templateUrl: './travel-config.component.html',
  styleUrls: ['./travel-config.component.scss']
})
export class TravelConfigComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  const save = () => {
    console.log('save')

    const configToSave = {...travelConfigService.state.config}
    configToSave.label = label.value
    configToSave.maxDrivingTime = moment(maxDrivingTime.value, 'HH:mm').format('X')
    configToSave.start = moment(start.value, 'YYYY-MM-DDTHH:mm').tz(moment.tz.guess())
    travelConfigService.saveConfig(configToSave)
    modalOpen.value = false
  }

}
