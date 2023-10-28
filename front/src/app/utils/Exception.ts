export class Exception extends Error{
    constructor(message:string) {
        super(message);
    }

    getMessage(): string{
        return this.message;
    }
}
