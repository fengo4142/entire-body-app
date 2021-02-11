import React, { Suspense } from "react";
import { CreateExercisePlan } from "./Pages/CreateExercisePlan";

function App() {
  const location = {
    state: {
      plan_id: "",
    },
  };
  return (
    <Suspense fallback="loading">
      <CreateExercisePlan location={location} />
    </Suspense>
  );
}

export default App;
