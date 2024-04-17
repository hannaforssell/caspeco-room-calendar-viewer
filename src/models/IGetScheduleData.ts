export interface IGetScheduleRequest {
  schedules: string[];
  startTime: ITime;
  endTime: ITime;
  availabilityViewInterval: number;
}

export interface IGetScheduleResponse {
  "@odata.context": string;
  value: ISchedule[];
}

export interface ISchedule {
  scheduleId: string;
  availabilityView: string;
  scheduleItems: IScheduleItem[];
  workingHours: IWorkingHours;
}

export interface IScheduleItem {
  isPrivate: boolean;
  status: string;
  subject: string;
  location: string;
  isMeeting: boolean;
  isRecurring: boolean;
  isException: boolean;
  isReminderSet: boolean;
  start: ITime;
  end: ITime;
}

export interface ITime {
  dateTime: string;
  timeZone: string;
}

export interface IWorkingHours {
  daysOfWeek: string[];
  startTime: string;
  endTime: string;
  timeZone: ITimeZone;
}

export interface ITimeZone {
  name: string;
}
