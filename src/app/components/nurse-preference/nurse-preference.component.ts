// import {SelectionModel} from '@angular/cdk/collections';
 import {Component} from '@angular/core';


@Component({
    selector: 'app-nurse-preference',
    templateUrl: './nurse-preference.component.html',
    styleUrls: ['./nurse-preference.component.css']
  })
  export class NursePreferenceComponent {
    shifts: string[];
    timetable: string[];
    constructor(){
      this.shifts = ["early", "late", "evening", "night"];
      this.timetable = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
      
    }
  }

// export interface PeriodicElement {
//   name: string;
//   position: number;
//   weight: string[];
//   symbol: string;
// }

// const ELEMENT_DATA: PeriodicElement[] = [
//   {position: 1, name: 'Hydrogen', weight:["test", "test1"], symbol: 'H'},
//   {position: 2, name: 'Helium', weight:["test2", "test3"], symbol: 'He'},
// ];

// @Component({
//   selector: 'app-nurse-preference',
//   templateUrl: './nurse-preference.component.html',
//   styleUrls: ['./nurse-preference.component.css']
// })
// export class NursePreferenceComponent {
//   displayedColumns: string[] = ['select', 'position', 'name', 'weight', 'symbol'];
//   data = ELEMENT_DATA;
//   dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
//   selection = new SelectionModel<PeriodicElement>(true, []);

//   /** Whether the number of selected elements matches the total number of rows. */
//   isAllSelected() {
//     const numSelected = this.selection.selected.length;
//     const numRows = this.dataSource.data.length;
//     return numSelected === numRows;
//   }

//   /** Selects all rows if they are not all selected; otherwise clear selection. */
//   toggleAllRows() {
//     if (this.isAllSelected()) {
//       this.selection.clear();
//       return;
//     }

//     this.selection.select(...this.dataSource.data);
//   }

//   /** The label for the checkbox on the passed row */
//   checkboxLabel(row?: PeriodicElement): string {
//     if (!row) {
//       return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
//     }
//     return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
//   }
// }
