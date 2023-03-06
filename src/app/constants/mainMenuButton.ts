import { MainMenuButton } from "../models/MainMenuButton";

const ASSETS_FOLDER_LOCATION = "../../assets";
export const MAIN_MENU_BUTTONS: MainMenuButton[] = [
  {
    title: "Schedule",
    description:
      "View the previously generated schedule or generate a new schedule.",
    icon: ASSETS_FOLDER_LOCATION + "/calendar.png",
  },
  {
    title: "Contracts",
    description:
      "View and modify the  available contracts or create a new contract.",
    icon: ASSETS_FOLDER_LOCATION + "/contract.png",
  },
  {
    title: "Nurse",
    description: "View and modify the  available nurses or add a new nurse.",
    icon: ASSETS_FOLDER_LOCATION + "/identification.png",
  },
  {
    title: "Shift",
    description: "View and modify the  available Shift or create a new shift.",
    icon: ASSETS_FOLDER_LOCATION + "/time.png",
  },

  {
    title: "User",
    description: "Allow admin to create and delete other users account",
    icon: ASSETS_FOLDER_LOCATION + "/add-user.png"
  }
];
