export const BASE_URL = "http://localhost:5000";
export const TEST_URL = BASE_URL + "/index/";
export const SCHEDULE_URL = BASE_URL + "/schedule";
export const NAME_FILTER_SCHEDULE_URL = SCHEDULE_URL + "/nameFilter";
export const PROTOTYPE_SCHEDULE_URL = NAME_FILTER_SCHEDULE_URL + "/prototype";
export const CONTRACT_URL= BASE_URL + "/contract";
const ADD_STRING = "/add";
const REMOVE_STRING = "/remove"
const FETCH_NAMES="/fetchAllNames";
const FETCH_BY_NAMES = "/fetchByName";
const UPDATE= "/update"

export const ADD_CONTRACT_URL = CONTRACT_URL + ADD_STRING;

export const USER_URL = BASE_URL + "/user";
export const LOGIN_URL = USER_URL + "/login";
export const ADD_ACCOUNT_URL = USER_URL + ADD_STRING;
const DELETE_STRING = "/delete";
export const DELETE_ACCOUNT_URL = USER_URL + DELETE_STRING;
const FETCH_USERNAMES="/fetchAllUsernames";
export const GET_USERNAMES = USER_URL + FETCH_USERNAMES;
export const LOGOUT_URL = USER_URL + "/logout"



export const SHIFT_URL= BASE_URL + "/shift";
export const FETCH_SHIFT_NAMES = SHIFT_URL + FETCH_NAMES;
export const FETCH_SHIFT_BY_NAMES = SHIFT_URL + FETCH_BY_NAMES;
export const ADD_SHIFT_URL = SHIFT_URL + ADD_STRING;
export const REMOVE_SHIFT_URL = SHIFT_URL + REMOVE_STRING;
export const UPDATE_SHIFT_URL = SHIFT_URL + UPDATE;


export const SHIFT_TYPE_URL = BASE_URL + "/shiftType";
export const ADD_SHIFT_TYPE_URL = SHIFT_TYPE_URL + ADD_STRING;
export const REMOVE_SHIFT_TYPE_URL = SHIFT_TYPE_URL + REMOVE_STRING;
export const FETCH_SHIFT_TYPE_NAMES = SHIFT_TYPE_URL + FETCH_NAMES;
export const FETCH_SHIFT_TYPE_BY_NAMES = SHIFT_TYPE_URL + FETCH_BY_NAMES;
export const UPDATE_SHIFT_TYPE_URL = SHIFT_TYPE_URL + UPDATE;


export const SHIFT_GROUP_URL = BASE_URL + "/shiftGroup";
export const ADD_SHIFT_GROUP_URL = SHIFT_GROUP_URL + ADD_STRING;
export const REMOVE_SHIFT_GROUP_URL = SHIFT_GROUP_URL + REMOVE_STRING;
export const FETCH_SHIFT_GROUP_NAMES = SHIFT_GROUP_URL + FETCH_NAMES;
export const FETCH_SHIFT_GROUP_BY_NAMES = SHIFT_GROUP_URL + FETCH_BY_NAMES;
export const UPDATE_SHIFT_GROUP_URL = SHIFT_GROUP_URL + UPDATE;
const FETCH_ALL = "/fetchAll"

export const FETCH_CONTRACT_NAMES = CONTRACT_URL + FETCH_NAMES;

export const SKILLS_URL = BASE_URL + "/skill";
export const FETCH_SKILLS = SHIFT_URL + FETCH_ALL;
export const PROFILE_URL = BASE_URL + "/profile";
export const CREATE_EMPTY_PROFILE = PROFILE_URL + "/createEmpty";
export const FETACH_PROFILES = PROFILE_URL + FETCH_ALL;
const DUPLICATE = "/duplicate";
export const DUPLICATE_PROFILE= PROFILE_URL + DUPLICATE;
export const DELETE_PROFILE = PROFILE_URL + DELETE_STRING;