import { WorkoutRecord } from "./types";

const WORKOUTS_MOCK: WorkoutRecord[] = [
  {
    id: "5",
    dateTime: "2023-03-01T12:00:00",
    exercise: {
      id: "5",
      name: "Bench Press",
      category: {
        id: "5",
        name: "Upper Body",
        icon: "back",
      },
    },
    sets: [
      {
        weight: 100,
        reps: 10,
      },
      {
        weight: 120,
        reps: 8,
      },
    ],
  },
  {
    id: "1",
    dateTime: "2023-03-01T12:00:00",
    exercise: {
      id: "1",
      name: "Bench Press",
      category: {
        id: "1",
        name: "Upper Body",
        icon: "chest",
      },
    },
    sets: [],
  },
  {
    id: "2",
    dateTime: "2023-03-01T12:00:00",
    exercise: {
      id: "2",
      name: "Bench Press",
      category: {
        id: "2",
        name: "Upper Body",
        icon: "arm",
      },
    },
    sets: [],
  },
  {
    id: "3",
    dateTime: "2023-03-01T12:00:00",
    exercise: {
      id: "3",
      name: "Bench Press",
      category: {
        id: "3",
        icon: "shoulder",
        name: "Upper Body",
      },
    },
    sets: [],
  },
  {
    id: "4",
    dateTime: "2023-03-01T12:00:00",
    exercise: {
      id: "4",
      name: "Bench Press",
      category: {
        id: "4",
        name: "Upper Body",
        icon: "quadriceps",
      },
    },
    sets: [],
  },
];
