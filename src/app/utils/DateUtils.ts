export class DateUtils{
    public static nbDaysDifference(endDate: Date, startDate: Date):number{
        return (+endDate - +startDate)/(1000*60*60*24)
    }
}