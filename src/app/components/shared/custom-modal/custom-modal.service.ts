import {Injectable} from '@angular/core';
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {CustomModalComponent, CustomModalConfig} from "./custom-modal.component";

@Injectable()
export class CustomModalService {
  dialogRef!: MatDialogRef<CustomModalComponent>;

  constructor(
    private dialog: MatDialog
  ) {
  }

  public open(customModalConfig: CustomModalConfig, matModalConfig: MatDialogConfig | null = null) {
    if (!customModalConfig.type) customModalConfig.type = 'primary';

    let mergedModalConfig = {
      data: {
        ...customModalConfig
      },
      width: '500px'
    };

    if (matModalConfig) {
      mergedModalConfig = Object.assign(mergedModalConfig, matModalConfig);
    }

    this.dialogRef = this.dialog.open(CustomModalComponent, mergedModalConfig);

    return this.dialogRef.componentInstance;
  }
}
