import {
  faAd,
  faPizzaSlice,
  faRunning,
} from "@fortawesome/free-solid-svg-icons";

export const CONSTANTS = {
  tags: [
    {
      name: "my tag",
      icon: faAd,
      tagColor: "#fb781f",
    },
    {
      name: "motivation",
      icon: faPizzaSlice,
      tagColor: "#26a69a",
    },
    {
      name: "Running",
      icon: faRunning,
      tagColor: "#3f3fc3",
    },
  ],
  compactViewStyle: {
    height: "5.1rem",
    opacity: 1,
    paddingTop: "1rem",
    paddingBottom: "1rem",
  },
  iconPickerX: -9999999,
  iconPickerY: -9999999,
  defaultCategory: "strength",
  defaultProgram: "customer",
};

export const getPlanCategory = (exercisePlan) => {
  const planCategories = [
    "Strength",
    "cardio",
    "strength & cardio",
    "Crossfit",
  ];

  return planCategories
    .map((item) => item.trim().toLowerCase())
    .includes(exercisePlan.plan_type.toLowerCase())
    ? exercisePlan.plan_type.toLowerCase()
    : CONSTANTS.defaultCategory;
};
