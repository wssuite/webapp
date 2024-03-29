export const BASE_URL = "/api";
export const TEST_URL = BASE_URL + "/index";
export const SCHEDULE_URL = BASE_URL + "/schedule";
export const GENERATE_SCHEDULE = SCHEDULE_URL + "/generate";
export const EXPORT_PROBLEM_URL = SCHEDULE_URL + "/exportProblem";
export const REGENERATE_SCHEDULE_URL = SCHEDULE_URL + "/regenerate";
export const CONFIG_SCHEDULE_URL = SCHEDULE_URL + "/config";
export const DETAILED_SOLUTION_URL = SCHEDULE_URL + "/getDetailedSolution";
export const ALL_SOLUTIONS = SCHEDULE_URL + "/getAllSolutions";
export const LATEST_SOLUTIONS = SCHEDULE_URL + "/getLatestSolutions";
export const REMOVE_SOLUTION = SCHEDULE_URL + "/removeSolution"
export const IMPORT_SOLUTION_URL = SCHEDULE_URL + "/importSolution";
export const STOP_GENERATION_URL = SCHEDULE_URL + "/stopGeneration"
export const EXPORT_SOLUTION_URL = SCHEDULE_URL + "/exportSchedule"
export const EXPRORT_ERROR_URL = SCHEDULE_URL + "/exportError"
export const GET_STATISTIC_URL = SCHEDULE_URL + "/getStatistics"

export const NAME_FILTER_SCHEDULE_URL = SCHEDULE_URL + "/nameFilter";
export const PROTOTYPE_SCHEDULE_URL = NAME_FILTER_SCHEDULE_URL + "/prototype";
export const CONTRACT_URL= BASE_URL + "/contract";
const ADD_STRING = "/add";
const REMOVE_STRING = "/remove"
const FETCH_NAMES="/fetchAllNames";
//const FETCH_ALL = "/fetchAll";
const FETCH_BY_NAME = "/fetchByName";
const REMOVE = "/remove";
//export const FETCH_SHIFT_NAMES = SHIFT_URL + FETCH_NAMES;
//export const SHIFT_GROUP_URL = BASE_URL + "/shiftGroup";
//export const FETCH_SHIFT_GROUP_NAMES = SHIFT_GROUP_URL + FETCH_NAMES;
//export const SHIFT_TYPE_URL = BASE_URL + "/shiftType";
//export const FETCH_SHIFT_TYPE_NAMES = SHIFT_TYPE_URL + FETCH_NAMES;
//export const FETCH_CONTRACT_NAMES = CONTRACT_URL + FETCH_NAMES;
const FETCH_BY_NAMES = "/fetchByName";
const FETCH_BY_USERNAME = "/fetchByUsername"
const UPDATE= "/update"

export const ADD_CONTRACT_URL = CONTRACT_URL + ADD_STRING;
export const FETCH_CONTRACT_NAMES = CONTRACT_URL + FETCH_NAMES;


export const USER_URL = BASE_URL + "/user";
export const LOGIN_URL = USER_URL + "/login";
export const ADD_ACCOUNT_URL = USER_URL + ADD_STRING;
const DELETE_STRING = "/delete";
export const DELETE_ACCOUNT_URL = USER_URL + DELETE_STRING;
const FETCH_USERNAMES="/fetchAllUsernames";
const FETCH_ALL = "/fetchAll"
export const GET_USERNAMES = USER_URL + FETCH_USERNAMES;
export const LOGOUT_URL = USER_URL + "/logout"
export const FETCH_CONTRACT_URL = CONTRACT_URL + FETCH_ALL;



export const SHIFT_URL= BASE_URL + "/shift";
export const FETCH_ALL_SHIFT = SHIFT_URL + FETCH_ALL;
export const FETCH_SHIFT_NAMES = SHIFT_URL + FETCH_NAMES;
export const FETCH_SHIFT_BY_NAMES = SHIFT_URL + FETCH_BY_NAMES;
export const ADD_SHIFT_URL = SHIFT_URL + ADD_STRING;
export const REMOVE_SHIFT_URL = SHIFT_URL + REMOVE_STRING;
export const UPDATE_SHIFT_URL = SHIFT_URL + UPDATE;


export const SHIFT_TYPE_URL = BASE_URL + "/shiftType";
export const FETCH_ALL_SHIFT_TYPE = SHIFT_TYPE_URL + FETCH_ALL;
export const ADD_SHIFT_TYPE_URL = SHIFT_TYPE_URL + ADD_STRING;
export const REMOVE_SHIFT_TYPE_URL = SHIFT_TYPE_URL + REMOVE_STRING;
export const FETCH_SHIFT_TYPE_NAMES = SHIFT_TYPE_URL + FETCH_NAMES;
export const FETCH_SHIFT_TYPE_BY_NAMES = SHIFT_TYPE_URL + FETCH_BY_NAMES;
export const UPDATE_SHIFT_TYPE_URL = SHIFT_TYPE_URL + UPDATE;


export const SHIFT_GROUP_URL = BASE_URL + "/shiftGroup";
export const FETCH_ALL_SHIFT_GROUP = SHIFT_GROUP_URL + FETCH_ALL;
export const ADD_SHIFT_GROUP_URL = SHIFT_GROUP_URL + ADD_STRING;
export const REMOVE_SHIFT_GROUP_URL = SHIFT_GROUP_URL + REMOVE_STRING;
export const FETCH_SHIFT_GROUP_NAMES = SHIFT_GROUP_URL + FETCH_NAMES;
export const FETCH_SHIFT_GROUP_BY_NAMES = SHIFT_GROUP_URL + FETCH_BY_NAMES;
export const UPDATE_SHIFT_GROUP_URL = SHIFT_GROUP_URL + UPDATE;


export const SKILLS_URL = BASE_URL + "/skill";
//export const FETCH_SKILLS = SHIFT_URL + FETCH_ALL;
export const PROFILE_URL = BASE_URL + "/profile";
export const CREATE_EMPTY_PROFILE = PROFILE_URL + "/createEmpty";
export const FETACH_PROFILES = PROFILE_URL + FETCH_ALL;
const DUPLICATE = "/duplicate";
export const DUPLICATE_PROFILE= PROFILE_URL + DUPLICATE;
export const DELETE_PROFILE = PROFILE_URL + DELETE_STRING;
const FETCH_ALL_ACCESSORS = "/fetchAllAccessors";
export const FETCH_PROFILE_ACCESSORS = PROFILE_URL + FETCH_ALL_ACCESSORS;
export const REVOKE_PROFILE_ACCESS = PROFILE_URL + "/revokeAccess";
export const SHARE_PROFILE = PROFILE_URL + "/share";
export const IMPORT_PROFILE = PROFILE_URL + "/import";
export const SAVE_IMPORT = PROFILE_URL + "/saveImport";
export const EXPORT_PROFILE = PROFILE_URL + "/export"
export const DOWNLOAD_IMPORT_TEMPLATE = PROFILE_URL + "/downloadTemplate"
//const UPDATE= "/update"
export const UPDATE_CONTRACT_URL = CONTRACT_URL + UPDATE;
export const FETCH_CONTRACT_BY_NAME = CONTRACT_URL + FETCH_BY_NAME;
export const DELETE_CONTRACT = CONTRACT_URL + REMOVE;
export const FETCH_SKILLS = SKILLS_URL + FETCH_NAMES;
export const DELETE_SKILL_URL = SKILLS_URL + DELETE_STRING;
export const ADD_SKILL_URL = SKILLS_URL + ADD_STRING
//export const FETCH_SKILLS = SHIFT_URL + FETCH_ALL;

export const NURSE_GROUP_URL = BASE_URL + "/nurseGroup"
export const ADD_NURSE_GROUP_URL = NURSE_GROUP_URL + ADD_STRING;
export const FETCH_NURSE_GROUP_URL = NURSE_GROUP_URL + FETCH_ALL;
export const FETCH_NURSE_GROUP_BY_NAME = NURSE_GROUP_URL + FETCH_BY_NAMES;
export const REMOVE_NURSE_GROUP_URL = NURSE_GROUP_URL + REMOVE_STRING;
export const FETCH_ALL_NURSE_GROUP_NAME = NURSE_GROUP_URL + FETCH_NAMES;
export const UPDATE_NURSE_GROUP_URL = NURSE_GROUP_URL + UPDATE;

export const NURSE_URL = BASE_URL + "/nurse"
export const ADD_NURSE_URL = NURSE_URL + ADD_STRING;
export const FETCH_NURSE_URL = NURSE_URL + FETCH_ALL;
export const FETCH_NURSE_BY_USERNAME = NURSE_URL + FETCH_BY_USERNAME;
export const REMOVE_NURSE_URL = NURSE_URL + REMOVE_STRING;
export const FETCH_ALL_NURSE_USERNAME = NURSE_URL + FETCH_USERNAMES;
export const UPDATE_NURSE_URL = NURSE_URL + UPDATE;


export const CONTRACT_GROUP_URL = BASE_URL + "/contractGroup"
export const ADD_CONTRACT_GROUP_URL = CONTRACT_GROUP_URL + ADD_STRING;
export const FETCH_CONTRACT_GROUP_URL = CONTRACT_GROUP_URL + FETCH_ALL;
export const FETCH_CONTRACT_GROUP_BY_NAME = CONTRACT_GROUP_URL + FETCH_BY_NAMES;
export const REMOVE_CONTRACT_GROUP_URL = CONTRACT_GROUP_URL + REMOVE_STRING;
export const FETCH_ALL_CONTRACT_GROUP_NAME = CONTRACT_GROUP_URL + FETCH_NAMES;
export const UPDATE_CONTRACT_GROUP_URL = CONTRACT_GROUP_URL + UPDATE;

export const SOCKET_URL = "/socket/"
