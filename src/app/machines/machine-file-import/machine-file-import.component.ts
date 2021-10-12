import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';
import { CsvModel } from '../csv.model';
import { MachineService } from '../machine.service';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-machine-file-import',
  templateUrl: './machine-file-import.component.html',
  styleUrls: ['./machine-file-import.component.css'],
})
export class MachineFileImportComponent implements OnInit {
  header: boolean = true;
  loading: boolean = true;
  isLoading: boolean = false;
  isValidFile: boolean = false;
  csvRecords: CsvModel[] = [];
  form: FormGroup;

  sampleCheckList: Array<any> = ['S.No.', 'Name', 'Age', 'Class'];
  selectedCheckList = [];
  dataTypes = [
    { id: 'string', value: 'String' },
    { id: 'boolean', value: 'Boolean' },
    { id: 'integer', value: 'Integer' },
  ];

  constructor(
    private ngxCsvParser: NgxCsvParser,
    public machineService: MachineService,
    public dialogRef: MatDialogRef<MachineFileImportComponent>,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      // this.form2 = this.fb.group({
      checkList: this.addCheckListItem(),
    });
    console.log('On Constructor: ', this.isValidFile);
  }

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
          this.isValidFile = true;
          this.csvRecords.push(...result);
          console.log('Records as Array', this.csvRecords);
          console.log('On Valid File: ', this.isValidFile);
        },
        (error: NgxCSVParserError) => {
          console.log('Error', error);
        }
      );
  }

  addCheckListItem() {
    const arr = this.sampleCheckList.map((e) => {
      return this.fb.control(false);
    });

    return this.fb.array(arr);
  }

  get checkItem() {
    return this.form.get('checkList') as FormArray;
  }

  getSelectedCheckList() {
    this.selectedCheckList = [];
    this.checkItem.controls.forEach((control, i) => {
      if (control.value) {
        this.selectedCheckList.push(this.sampleCheckList[i]);
      }
    });

    console.log(this.selectedCheckList);
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

  // Attempt 1
  // form2 = this.fb.group({
  //   dataValues: this.fb.array([]),
  // });

  // get dataValues() {
  //   return this.form2.controls['dataValues'] as FormArray;
  // }
}
