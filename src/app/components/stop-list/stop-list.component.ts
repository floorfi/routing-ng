import { Component, OnInit } from '@angular/core';
import {StepService} from '../../services/step.service';
import {Step} from '../../interfaces/step.interface';

@Component({
  selector: 'app-stop-list',
  templateUrl: './stop-list.component.html',
  styleUrls: ['./stop-list.component.scss']
})
export class StopListComponent implements OnInit {

  steps: Step[] = [];

  constructor(
    private stepService: StepService
  ) { }

  ngOnInit(): void {
    this.steps = this.stepService.steps
  }

}
