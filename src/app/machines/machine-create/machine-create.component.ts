import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { MachineService } from '../machine.service';

@Component({
  selector: 'app-machine-create',
  templateUrl: './machine-create.component.html',
  styleUrls: ['./machine-create.component.css'],
})
export class MachineCreateComponent implements OnInit {
  SignalType = [
    { id: 'Analog', value: 'Analog' },
    { id: 'Standard', value: 'Standard' },
  ];
  public isLoading: boolean = false;
  constructor(
    public machineService: MachineService,
    public dialogRef: MatDialogRef<MachineCreateComponent>
  ) {}

  ngOnInit(): void {}

  onSaveMachine(form: NgForm) {
    // console.log('Machine create form values: ', form.value);
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.machineService.addMachine(
      form.value.name,
      form.value.type,
      form.value.signal,
      form.value.angSignal,
      form.value.modbus
    );
    this.onCancel(form);
  }

  onCancel(form: NgForm) {
    form.resetForm();
    this.dialogRef.close();
  }
}
