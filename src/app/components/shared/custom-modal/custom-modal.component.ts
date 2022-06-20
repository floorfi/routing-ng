import {Component, ComponentRef, EventEmitter, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CustomModalDirective} from "./custom-modal.directive";

export interface CustomModalConfig {
  title: string;
  message?: string;
  component?: any;
  inputs?: any;
  type?: string;
}

@Component({
  selector: 'app-custom-modal',
  templateUrl: './custom-modal.component.html',
  styleUrls: ['./custom-modal.component.scss']
})

export class CustomModalComponent implements OnInit {
  @ViewChild(CustomModalDirective, {static: true}) container!: CustomModalDirective;
  componentRef!: ComponentRef<any>;

  buttonEvent: EventEmitter<boolean> = new EventEmitter();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CustomModalConfig,
    private dialogRef: MatDialogRef<CustomModalComponent>,
  ) {
  }

  ngOnInit() {
    if (this.data.component) {
    }
  }

  public close() {
    this.dialogRef.close();
  }

  public confirm() {
    this.buttonEvent.emit(true);
  }

  public cancel() {
    this.buttonEvent.emit(false);
    close();
  }
}
