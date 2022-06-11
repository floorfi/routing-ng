import { Component, OnInit } from '@angular/core';
import {StepService} from '../../services/step.service';
import {Step} from '../../classes/step.class';
import {StepStore} from '../../store/step.store';

@Component({
  selector: 'app-stop-list',
  templateUrl: './stop-list.component.html',
  styleUrls: ['./stop-list.component.scss']
})
export class StopListComponent implements OnInit {

  steps: Step[] = [];

  constructor(
    private stepService: StepService,
    private stepStore: StepStore
  ) { }

  ngOnInit(): void {
    this.stepStore.steps$.subscribe(steps => {
      this.steps = steps
    })
  }

}
