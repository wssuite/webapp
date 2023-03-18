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

  areAllSelected() {
    return this.elements.length == this.allPossibleElements.length;
  }

  areNoneSelected() {
    return this.elements.length == 0;
  }

  isCustomSelectorActive(elements: string[]) {
    let areAllSelected = true;

    for(let element of elements)
      if(!this.isSelected(element))
        areAllSelected = false;

    return areAllSelected && elements.length == this.elements.length;
  }

  selectAll() {
    this.replaceElements(this.allPossibleElements);
    this.selectionChanged.emit(true);
  }

  deselectAll() {
    this.resetElements();
    this.selectionChanged.emit(true);
  }

  applyCustomSelection(elementsToSelect: string[]) {
    this.replaceElements(elementsToSelect);
    this.selectionChanged.emit(true);
  }

  private replaceElements(newElements: string[]) {
    this.resetElements();
    this.fillElements(newElements);
  }

  private fillElements(newElements: string[]) {
    for(let element of newElements) {
      this.elements.push(element);
    }
  }

  private resetElements() {
    this.elements.splice(0, this.elements.length);
  }

}
