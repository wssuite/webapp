export class CustomSelector {
    name: string;
    elementsToSelect: string[];

    constructor(name: string, elements: string[]) {
        this.name = name;
        this.elementsToSelect = elements;
    }
}