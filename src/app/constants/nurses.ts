import {  NurseGroup, NurseInterface} from "../models/Nurse";

export const nurses_name_example:string[] = ["Caroline", "Zoe", "Mal", "Kyro", "Mark"]

export const nurses_example: NurseInterface[] = [
  {
    name: "Patrice",
    contracts: [
      "HeadNurse contract",
      "Pediatries contract",
      "Nurse contract",
      "Patrick's contract",
    ],
    username: "Pat",
  },
  {
    name: "Eve",
    contracts: ["HeadNurse contract", "Pediatries contract", "Nurse contract"],
    username: "Eve",
  },
  {
    name: "Andrew",
    contracts: ["HeadNurse contract", "Pediatries contract", "Nurse contract"],
    username: "And",
  },
  {
    name: "Monique",
    contracts: ["HeadNurse contract", "Pediatries contract", "Nurse contract"],
    username: "Mon",
  },
  {
    name: "Genevive",
    contracts: ["HeadNurse contract", "Pediatries contract", "Nurse contract"],
    username: "Gen",
  },
  {
    name: "Jessica",
    contracts: ["HeadNurse contract", "Pediatries contract", "Nurse contract"],
    username: "Jes",
  },
  {
    name: "Alice",
    contracts: ["HeadNurse contract", "Pediatries contract", "Nurse contract"],
    username: "Ali",
  },
];

export const nursesGroup_example: NurseGroup[] = [
  {
    name: "HeadNurse contract",
    contracts: [
      "HeadNurse contract",
    ],
    nurses:  [ {
      name: "Genevive",
      contracts: ["HeadNurse contract", "Pediatries contract", "Nurse contract"],
      username: "Gen",
    },
    {
      name: "Jessica",
      contracts: ["HeadNurse contract", "Pediatries contract", "Nurse contract"],
      username: "Jes",
    },
    {
      name: "Alice",
      contracts: ["HeadNurse contract", "Pediatries contract", "Nurse contract"],
      username: "Ali",
    }]
  },
  {
    name: "Pediatries contract",
    contracts: [
      "Pediatries contract",
    ],
    nurses:  [ {
      name: "Sophie",
      contracts: ["HeadNurse contract", "Pediatries contract", "Nurse contract"],
      username: "Gen",
    },
    {
      name: "Martine",
      contracts: ["HeadNurse contract", "Pediatries contract", "Nurse contract"],
      username: "Jes",
    },
    {
      name: "Florence",
      contracts: ["HeadNurse contract", "Pediatries contract", "Nurse contract"],
      username: "Ali",
    }]
  },
  {
    name: "Nurse contract",
    contracts: [
      "Nurse contract",
    ],
    nurses:  [ {
      name: "Sara",
      contracts: ["HeadNurse contract", "Pediatries contract", "Nurse contract"],
      username: "Gen",
    },
    {
      name: "Caroline",
      contracts: ["HeadNurse contract", "Pediatries contract", "Nurse contract"],
      username: "Jes",
    },
    {
      name: "Mara",
      contracts: ["HeadNurse contract", "Pediatries contract", "Nurse contract"],
      username: "Ali",
    }]
  }
];

