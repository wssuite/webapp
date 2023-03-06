export class Account {
    username: string;
    password: string;

    constructor() {
      this.username = '';
      this.password = '';
  }

  }

export interface AccountInterface {
  username: string;
  password: string;
}
