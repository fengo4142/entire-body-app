/**
 * Just for demo purpose
 */

const initialState = {
  coachState: {
    coachExercisePlanState: {
      exercisePlan: {
        name: "",
        info: "",
      },
    },
  },
  userState: {
    user: {
      token: "",
    },
  },
};

export default function reducer(state = initialState, action) {
  return state;
}
