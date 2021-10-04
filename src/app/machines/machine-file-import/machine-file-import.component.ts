import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';
import { CsvModel } from '../csv.model';
import { MachineService } from '../machine.service';

@Component({
  selector: 'app-machine-file-import',
  templateUrl: './machine-file-import.component.html',
  styleUrls: ['./machine-file-import.component.css'],
})
export class MachineFileImportComponent implements OnInit {
  header: boolean = true;
  loading: boolean = true;
  isLoading: boolean = false;
  csvRecords: CsvModel[] = [];

  constructor(
    private ngxCsvParser: NgxCsvParser,
    public machineService: MachineService,
    public dialogRef: MatDialogRef<MachineFileImportComponent>
  ) {}

  ngOnInit(): void {}

  @ViewChild('fileImportInput') fileImportInput: any;

  fileChangeListener($event: any): void {
    const files = $event.srcElement.files;
    this.header =
      (this.header as unknown as string) === 'true' || this.header === true;
    this.readData(files);
  }

  readData(files) {
    this.ngxCsvParser
      .parse(files[0], { header: this.header, delimiter: ',' })
      .pipe()
      .subscribe(
        (result: Array<any>) => {
          this.csvRecords.push(...result);
          console.log('Records as Array', this.csvRecords);
        },
        (error: NgxCSVParserError) => {
          console.log('Error', error);
        }
      );
  }

  onAddFile() {
    if (this.csvRecords.length > 0) {
      this.machineService.importCsv(this.csvRecords);
      setTimeout(() => {
        this.isLoading = true;
        this.machineService.getMachines();
        this.dialogRef.close();
      }, 1000);
      this.isLoading = false;
    }
    console.log('CSV: ', this.csvRecords);
  }
}
