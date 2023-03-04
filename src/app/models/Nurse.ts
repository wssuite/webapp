export class Nurse {
  name: string;
  contracts: string[];
  username: string;
  nurse_id: string;

  constructor() {
    this.name = "";
    this.contracts = [""];
    this.username = "";
    this.nurse_id = "0";
  }
}

export interface NurseInterface {
  name: string;
  contracts: string[];
  username: string;
}

export interface NurseGroup {
  name: string;
  contracts: string[];
  nurses: NurseInterface[];
}