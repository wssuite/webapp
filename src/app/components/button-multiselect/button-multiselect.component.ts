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

  constructor(){
    this.elementsChange = new EventEmitter<string[]>;
  }

  toggleElement(elementName: string) {
    const isSelected = this.isSelected(elementName);

    if (isSelected) {
      const elementIndex = this.elements.indexOf(elementName);
      this.elements.splice(elementIndex, 1);
    } else {
      this.elements.push(elementName);
    }
  }

  isSelected(elementName: string) {
    return this.elements.includes(elementName);
  }

  selectAll() {
    this.elements = [...this.allPossibleElements];
  }

  deselectAll() {
    this.elements = [];
  }

  applyCustomSelection(elementsToSelect: string[]) {
    this.elements = [...elementsToSelect];
  }

}
