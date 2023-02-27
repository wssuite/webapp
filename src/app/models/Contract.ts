export class Contract {
    name: string;
    // use of any type to be able to display the different templates
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constraints: any[];

    constructor() {
        this.name = '';
        this.constraints = [];
    }
}