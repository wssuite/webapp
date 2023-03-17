import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-button-multiselect",
  templateUrl: "./button-multiselect.component.html",
  styleUrls: ["./button-multiselect.component.css"],
})
export class ButtonMultiselectComponent {
  @Input() elements!: string[];
  @Output() elementsChange!: EventEmitter<string[]>;

  @Input() allPossibleElements!: string[];

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
}
