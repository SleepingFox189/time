export interface ScheduleItem {
  title: string;
  description: string;
  time: string;
  startTime: string; // 24-hour format for easier comparison
  endTime: string;   // 24-hour format for easier comparison
}

export const scheduleData: ScheduleItem[] = [
  {
    title: "Homeroom",
    description: "Morning check-in and announcements",
    time: "7:50 - 8:00 AM",
    startTime: "07:50",
    endTime: "08:00"
  },
  {
    title: "Period 1",
    description: "Start your learning journey",
    time: "8:00 - 9:00 AM",
    startTime: "08:00",
    endTime: "09:00"
  },
  {
    title: "Period 2",
    description: "Build on your knowledge",
    time: "9:03 - 10:03 AM",
    startTime: "09:03",
    endTime: "10:03"
  },
  {
    title: "Period 3",
    description: "Keep the momentum going",
    time: "10:06 - 11:06 AM",
    startTime: "10:06",
    endTime: "11:06"
  },
  {
    title: "Period 4",
    description: "Final morning session",
    time: "11:09 - 12:09 PM",
    startTime: "11:09",
    endTime: "12:09"
  },
  {
    title: "Lunch",
    description: "Time to rest and refuel",
    time: "12:12 - 12:37 PM",
    startTime: "12:12",
    endTime: "12:37"
  },
  {
    title: "WIN",
    description: "What I Need - Personalized learning time",
    time: "12:40 - 1:25 PM",
    startTime: "12:40",
    endTime: "13:25"
  },
  {
    title: "Related Arts",
    description: "Explore creativity and special interests",
    time: "1:28 - 3:00 PM",
    startTime: "13:28",
    endTime: "15:00"
  },
  {
    title: "Dismissal",
    description: "Wrap up your day",
    time: "3:00 PM",
    startTime: "15:00",
    endTime: "15:10" // Adding a small buffer for dismissal
  }
];
