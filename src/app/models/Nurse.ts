export interface NurseInterface {
  name: string;
  username: string;
  contracts: string[];
  profile: string;
}

export interface NurseGroupInterface {
  name: string;
  contracts: string[];
  nurses: string[];
  profile: string;
}