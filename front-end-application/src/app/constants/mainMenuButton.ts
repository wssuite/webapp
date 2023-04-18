import { MainMenuButton } from "../models/MainMenuButton";

const ASSETS_FOLDER_LOCATION = "../../assets";
export const MAIN_MENU_BUTTONS: MainMenuButton[] = [
  {
    title: "Shifts & Skills",
    description: "View and modify available shifts, skills, skill types or skill groups or create new ones.",
    icon: ASSETS_FOLDER_LOCATION + "/time.png",
  },
  {
    title: "Contracts",
    description:
      "View and modify available contracts or contract groups or create new ones.",
    icon: ASSETS_FOLDER_LOCATION + "/contract.png",
  },
  {
    title: "Nurses",
    description: "View and modify available nurses or nurse groups or add new ones.",
    icon: ASSETS_FOLDER_LOCATION + "/identification.png",
  },
  {
    title: "Schedules",
    description:
      "View previously generated schedules or generate a new one.",
    icon: ASSETS_FOLDER_LOCATION + "/calendar.png",
  },

];
