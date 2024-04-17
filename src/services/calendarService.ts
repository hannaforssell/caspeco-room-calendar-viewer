import axios, { AxiosResponse } from "axios";
import {
  IGetScheduleRequest,
  IGetScheduleResponse,
} from "../models/IGetScheduleData";
import { Map } from "immutable";
import dayjs from "dayjs";
import { RoomStatus } from "../models/RoomStatus";
import { Schedule, ScheduleItem } from "../models/Schedule";
import { mapToSchedule, mapToSchedules } from "../mappers/scheduleMapper";
import { MeetingRoom } from "../models/MeetingRoom";

const BASE_URL = "https://graph.microsoft.com/v1.0";

export const allMeetingRooms = Map<string, MeetingRoom>([
  ["allrummet@caspeco.se", new MeetingRoom("Allrummet", 50)],
  ["room.alvamyrdal@caspeco.se", new MeetingRoom("Alva Myrdal", 7)],
  ["room.anderscelsius@caspeco.se", new MeetingRoom("Anders Celsius", 4)],
  ["annamarialenngren@caspeco.se", new MeetingRoom("Anna Maria Lenngren", 2)],
  ["room.armandduplantis@caspeco.se", new MeetingRoom("Armand Duplantis", 6)],
  ["barbroalving@caspeco.se", new MeetingRoom("Barbro Alving", 9)],
  ["room.baren@caspeco.se", new MeetingRoom("Baren", 4)],
  ["brorhjorth@caspeco.se", new MeetingRoom("Bror Hjorth", 3)],
  ["room.brunoliljefors@caspeco.se", new MeetingRoom("Bruno Liljefors", 12)],
  ["carlvonlinne@caspeco.se", new MeetingRoom("Carl Von Linné", 4)],
  ["room.daghammarskjold@caspeco.se", new MeetingRoom("Dag Hammarskjöld", 8)],
  ["room.etype@caspeco.se", new MeetingRoom("E-type", 10)],
  ["room.gunnar.leche@caspeco.se", new MeetingRoom("Gunnar Leche", 6)],
  ["ingemarbergman@caspeco.se", new MeetingRoom("Ingemar Bergman", 12)],
  ["room.karinboye@caspeco.se", new MeetingRoom("Karin Boye", 8)],
  ["room.koket@caspeco.se", new MeetingRoom("Köket", 0)],
  ["room.magdalenaandersson@caspeco.se", new MeetingRoom("Magdalena Andersson", 5)],
  ["room.musikrummet@caspeco.se", new MeetingRoom("Musikrummet", 6)],
  ["owethornqvist@caspeco.se", new MeetingRoom("Owe Thörnqvist", 6)],
  ["veronicamaggio@caspeco.se", new MeetingRoom("Veronica Maggio", 3)],
]);

export const getAllSchedules = async (
  accessToken: string
): Promise<Schedule[]> => {
  const today = dayjs().hour(0).minute(0).second(0).millisecond(0);  

  const requestData = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    data: {
      schedules: [...allMeetingRooms.keys()],
      startTime: {
        dateTime: today.hour(6).format("YYYY-MM-DDTHH:mm:ss"),
        timeZone: "UTC",
      },
      endTime: {
        dateTime: today.hour(22).format("YYYY-MM-DDTHH:mm:ss"),
        timeZone: "UTC",
      },
      availabilityViewInterval: 60,
    } as IGetScheduleRequest,
  };

  return axios(BASE_URL + "/me/calendar/getSchedule", requestData)
    .then((response: AxiosResponse<IGetScheduleResponse>) =>
      mapToSchedules(response.data.value, dayjs(today))
    )
    .catch((error) => {
      throw error;
    });
};

export const getSchedule = async (
  accessToken: string,
  mail: string
): Promise<Schedule> => {
  const today = dayjs().hour(0).minute(0).second(0).millisecond(0);  

  const requestData = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    data: {
      schedules: [mail],
      startTime: {
        dateTime: today.hour(6).format("YYYY-MM-DDTHH:mm:ss"),
        timeZone: "UTC",
      },
      endTime: {
        dateTime: today.hour(22).format("YYYY-MM-DDTHH:mm:ss"),
        timeZone: "UTC",
      },
      availabilityViewInterval: 60,
    },
  };

  return axios(BASE_URL + "/me/calendar/getSchedule", requestData)
    .then((response) =>
      mapToSchedule(response.data.value[0], dayjs(today))
    )
    .catch((error) => {
      throw error;
    });
};

export const getRoomStatus = (
  scheduleItems: ScheduleItem[] | undefined,
  currentTime: dayjs.Dayjs
): [status: RoomStatus, meeting: ScheduleItem | undefined] => {
  if (!scheduleItems || scheduleItems.length === 0) {
    return [RoomStatus.available, undefined];
  }

  const meetingInProgress = scheduleItems.find(
    (i) =>
      currentTime.diff(i.start.dateTime) > 0 &&
      currentTime.diff(i.end.dateTime) < 0
  );

  if (meetingInProgress) {
    return [RoomStatus.unavailable, meetingInProgress];
  }

  const nextMeeting = scheduleItems.find(
    (i) => currentTime.diff(i.start.dateTime) < 0
  );

  if (nextMeeting) {   
    return [RoomStatus.soonUnavailable, nextMeeting];
  }

  return [RoomStatus.available, undefined];
};
