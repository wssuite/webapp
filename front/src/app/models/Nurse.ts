export interface NurseInterface {
  name: string;
  username: string;
  contracts: string[];
  contract_groups: string[];
  profile: string;
}

export interface NurseGroupInterface {
  name: string;
  contracts: string[];
  contract_groups: string[];
  nurses: string[];
  profile: string;
}