export class DateUtils {
  public static dayMultiplicationFactor = 1000 * 60 * 60 * 24;
  public static days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  public static weekdays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ]

  public static weekendDays = [
    "Saturday",
    "Sunday"
  ]
  public static nbDaysDifference(endDate: Date, startDate: Date): number {
    return (+endDate - +startDate) / this.dayMultiplicationFactor;
  }
  public static arrangeDateString(date: string): string {
    const splittedDate = date.split("-");
    return `${splittedDate[2]}-${splittedDate[1]}-${splittedDate[0]}`;
  }
}
