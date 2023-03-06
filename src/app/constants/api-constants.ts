export const BASE_URL = "http://localhost:5000/";
export const TEST_URL = BASE_URL + "index/";
export const SCHEDULE_URL = BASE_URL + "schedule/";
export const NAME_FILTER_SCHEDULE_URL = SCHEDULE_URL + "nameFilter/";
export const PROTOTYPE_SCHEDULE_URL = NAME_FILTER_SCHEDULE_URL + "prototype";
export const USER_URL = BASE_URL + "/user";
export const LOGIN_URL = USER_URL + "/login";
export const LOGOUT_URL = USER_URL + "/logout";
const ADD_STRING = "/add";
export const ADD_ACCOUNT_URL = USER_URL + ADD_STRING;
const DELETE_STRING = "/delete";
export const DELETE_ACCOUNT_URL = USER_URL + DELETE_STRING;
const FETCH_USERNAMES="/fetchAllUsernames";
export const GET_USERNAMES = USER_URL + FETCH_USERNAMES;

