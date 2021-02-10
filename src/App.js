import { CreateExercisePlan } from "./Pages/CreateExercisePlan";

function App() {
  const location = {
    state: {
      plan_id: "",
    },
  };
  return (
    <div className="App">
      <CreateExercisePlan location={location} />
    </div>
  );
}

export default App;
