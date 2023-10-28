export abstract class Constraint {
  name: string;
  displayName: string;
  description?: string;
  constructor(id: string, name: string, description?: string) {
    this.name = id;
    this.displayName = name;
    this.description = description;
  }
  abstract validateConstraint(c: Constraint):void;

  getRepetitiveErrorMessage(): string {
    return `Repetitive ${this.displayName} constraint`
  }

  getContradictionErrorMessage():string{
    return `${this.displayName} constraint contradiction`;
  }

  abstract toJson():ConstraintInterface;

  abstract fromJson(c: ConstraintInterface):void;

  abstract clone(): Constraint;

  abstract equals(c: Constraint): boolean;
}

export interface ConstraintInterface {
  name: string;
}
