export class DateUtils {
  public static dayMultiplicationFactor = 1000 * 60 * 60 * 24;
  public static days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
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
    return Math.round((+endDate - +startDate) / this.dayMultiplicationFactor) + 1;
  }
  public static arrangeDateString(date: string): string {
    const splittedDate = date.split("-");
    const month = +splittedDate[1].toString();
    const day = +splittedDate[2].toString()
    return `${splittedDate[0]}-${month}-${day}`;
  }
  public static addDays(date: Date, nDays: number) {
    date.setDate(date.getDate() + nDays);
    return date
  }
}
