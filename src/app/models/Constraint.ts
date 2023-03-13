export abstract class Constraint {
  name: string;
  displayName: string;
  constructor(id: string, name: string) {
    this.name = id;
    this.displayName = name;
  }
  abstract validateConstraint(c: Constraint):void;

  getRepetitiveErrorMessage(): string {
    return `Repetitive ${this.displayName} constraint`
  }

  getContradictionErrorMessage():string{
    return `${this.displayName} constraint contradiction`;
  }

  abstract toJson():ConstraintInterface;
}

export interface ConstraintInterface {
  name: string;
}
