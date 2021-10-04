import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { MachineCreateComponent } from '../machine-create/machine-create.component';
import { MachineEditComponent } from '../machine-edit/machine-edit.component';
import { Machine } from '../machine.model';
import { MachineService } from '../machine.service';
import { MachineFileImportComponent } from '../machine-file-import/machine-file-import.component';

@Component({
  selector: 'app-machine-list',
  templateUrl: './machine-list.component.html',
  styleUrls: ['./machine-list.component.css'],
})
export class MachineListComponent implements OnInit {
  displayedColumns = [
    'id',
    'name',
    'type',
    'signal',
    'angSignal',
    'modbus',
    'actions',
  ];
  ELEMENT_DATA: Machine[] = [];
  dataSource = new MatTableDataSource<Machine>(this.ELEMENT_DATA);
  // @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  // @ViewChild(MatPaginator, { static: false })
  // set paginator(v: MatPaginator) {
  //   this.dataSource.paginator = v;
  // }

  machines: Machine[] = [];
  isLoading: boolean = false;
  isVisible: boolean = false;
  private machinesSub: Subscription;
  length = this.machines.length;

  constructor(
    private dialog: MatDialog,
    public machineService: MachineService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.machineService.getMachines();
    this.machinesSub = this.machineService
      .getMachineUpdateListener()
      .subscribe((machines: Machine[]) => {
        this.isLoading = false;
        this.machines = machines;
        // console.log('Machine-list ngOnInit machines: ', machines);
        // this.dataSource.paginator = this.paginator;
        // console.log(
        //   'Machine-list ngOnInit dataSource: ',
        //   this.dataSource.paginator
        // );
      });
    // this.getAllMachines();
    // this.dataSource.paginator = this.paginator;
    // this.dataSource = new MatTableDataSource(this.machines);
    // setTimeout(() => (this.dataSource.paginator = this.paginator));
  }

  public getAllMachines() {
    let res = this.machineService.getDataMachines();
    res.subscribe((result) => {
      this.dataSource.data = result as Machine[];
    });
    console.log('getAllMachines  datasource: ', this.dataSource);
  }

  // ngAfterViewInit() {
  // this.dataSource.paginator = this.paginator;
  // this.dataSource = new MatTableDataSource(this.machines);
  // this.dataSource.paginator = this.paginator;
  // console.log('datSource elements:', this.dataSource);
  // console.log('ngAfterViewInit');
  // }

  showPopup() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.isVisible = true;
    this.dialog.open(MachineFileImportComponent);
  }

  onAddItem() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    this.dialog.open(MachineCreateComponent, dialogConfig);
  }

  onEdit(machine) {
    console.log(machine);
    this.machineService.postId(machine);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    this.dialog.open(MachineEditComponent, dialogConfig);
  }

  onDelete(machineId: string) {
    this.isLoading = true;
    this.machineService.deleteMachine(machineId);
    this.isLoading = false;
  }

  ngOnDestroy() {
    this.machinesSub.unsubscribe();
  }
}
