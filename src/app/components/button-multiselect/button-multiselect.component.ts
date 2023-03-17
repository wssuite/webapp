import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CustomSelector } from "src/app/models/CustomSelector";

@Component({
  selector: "app-button-multiselect",
  templateUrl: "./button-multiselect.component.html",
  styleUrls: ["./button-multiselect.component.css"],
})
export class ButtonMultiselectComponent {
  @Input() elements!: string[];
  @Output() elementsChange!: EventEmitter<string[]>;

  @Input() allPossibleElements!: string[];
  @Input() customSelectors!: CustomSelector[];

  @Output() selectionChanged!: EventEmitter<boolean>;

  constructor(){
    this.elementsChange = new EventEmitter<string[]>;
    this.selectionChanged = new EventEmitter<boolean>;
  }

  toggleElement(elementName: string) {
    const isSelected = this.isSelected(elementName);

    if (isSelected) {
      const elementIndex = this.elements.indexOf(elementName);
      this.elements.splice(elementIndex, 1);
    } else {
      this.elements.push(elementName);
    }

    this.selectionChanged.emit(true);
  }

  isSelected(elementName: string) {
    return this.elements.includes(elementName);
  }

  selectAll() {
    this.elements = [...this.allPossibleElements];
    this.selectionChanged.emit(true);
  }

  deselectAll() {
    this.elements = [];
    this.selectionChanged.emit(true);
  }

  applyCustomSelection(elementsToSelect: string[]) {
    this.elements = [...elementsToSelect];
    this.selectionChanged.emit(true);
  }

}
