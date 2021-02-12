import React from "react";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import Dropdown from "../../Custom/Dropdown";
import InputControl from "../../Custom/InputControl";

import style from "./ExerciseForm.module.scss";

export const ExerciseForm = (props) => {
  const { t } = useTranslation();
  const {
    periodIndex,
    workoutIndex,
    newExeIDSelected,
    exerciseList,
    isEmptySets,
    exerciseSets,
    exerciseReps,
    exerciseRest,
    isEmptyResistance,
    handleSubmit,
    handleExerciseSelect,
    handleExerciseInfoClick,
    handleInput,
    handleAddInfoClick,
  } = props;

  return (
    <>
      <h1 className={style.exe_number}>{t("ExercisePlan.exercise")}</h1>
      <form
        onSubmit={handleSubmit}
        className={classNames(style.form_exercise, style.exercise_list)}
      >
        <InputControl
          label={isEmptySets ? "Sets (Required)" : "Sets"}
          isEmpty={exerciseSets.length < 1}
          isError={isEmptySets}
          value={exerciseSets}
          onChange={handleInput("exercise_sets")}
          spanClass={style.new_period_time_filler}
        >
          <Dropdown
            showInfo
            searchable
            selected={newExeIDSelected}
            width={"100%"}
            maxHeight={"30rem"}
            headerBgColor={"white"}
            paddingVertical={"0.2rem"}
            paddingHorizontal={"1rem"}
            itemData={exerciseList}
            childStyleClassName={style.exercise}
            itemClick={handleExerciseSelect}
            onInfoClick={handleExerciseInfoClick}
          >
            {exerciseList.map((exe) => (
              <div key={exe.id} className={style.exercise}>
                {exe.name}
              </div>
            ))}
          </Dropdown>
        </InputControl>

        <InputControl
          type="text"
          label={t("ExercisePlan.reps")}
          isEmpty={exerciseReps.length < 1}
          isError={isEmptySets}
          value={exerciseReps}
          onChange={handleInput("exercise_reps")}
          spanClass={style.new_period_time_filler}
        />

        <InputControl
          type="text"
          label={t("ExercisePlan.rest")}
          isEmpty={exerciseRest.length < 1}
          isError={isEmptyResistance}
          className={style.input_control_exe}
          value={exerciseRest}
          onChange={handleInput("exercise_rest")}
          spanClass={style.new_period_time_filler}
        />

        <button
          className={style.add_exe_info_button}
          onClick={handleAddInfoClick(true, null, periodIndex, workoutIndex, -1)}
        >
          {t("ExercisePlan.add-info")}
        </button>
      </form>
    </>
  );
};
