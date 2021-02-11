import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import {
  createExercisePlan,
  updateExercisePlan,
  getExercisePlan,
} from "../Redux/Component/Coach/ExercisePlan/ExercisePlanActions";
import { CONSTANTS, getPlanCategory, getPlanProgram } from "../Utils";
import Loading from "../Components/General/Loading/Loading";
import InputControl from "../Components/Custom/InputControl";
import PeriodWorkoutView from "./PeriodAndWorkoutView/PeriodWorkoutView";
import style from "./CreateExercisePlan.module.scss";

export const CreateExercisePlan = (props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation([]);
  const { location } = props;

  const { coachExercisePlanState, token } = useSelector((state) => ({
    coachExercisePlanState: state.coachState.coachExercisePlanState,
    token: state.userState.user.token,
  }));

  const callbackRef = useRef(true);
  const fullViewRef = useRef();
  const periodWorkoutViewRef = useRef();
  const [tags, setTags] = useState(CONSTANTS.tags);
  const [showCompactView, setShowCompactView] = useState(false);
  const [state, setState] = useState({
    isPeriodDataLoaded: false,
    planID: -1,
    periodData: [],
    exePlanName: coachExercisePlanState.exercisePlan.name,
    exePlanDes: coachExercisePlanState.exercisePlan.info,
    currentFullHeight: 0,
    currentPeriodWorkoutViewHeight: 0,
    fullViewStyle: {
      maxHeight: 1000,
      opacity: 1,
    },
    periodWorkoutViewStyle: {
      maxHeight: 0,
      opacity: 0,
    },
    isExePlanNameEmpty: false,
    isExePlanDesEmpty: false,
    isError: false,
    missingField: "",
    selectedCategory: "strength",
    selectedProgram: "program",
  });

  useEffect(() => {
    //Check if the ID is -1 or undefined that means you need to make a new plan
    const { plan_id } = location.state;
    if (!plan_id) {
      //make a new plan
      setState({
        ...state,
        isPeriodDataLoaded: true,
        planID: -1,
        periodData: [
          {
            id: -1,
            name: "",
            info: "",
            start_time: 1,
            end_time: 2,
            workouts: [],
          },
        ],
      });
    }
    // else get the plan data from the server using the ID and send that Data to periodWorkoutView component
    // as wel ass fill in the exercise plan state
    else {
      //fetch the data from server
      const payload = { mode: "id", program_id: plan_id };
      dispatch(getExercisePlan(token, payload)).then(() => {
        const { isExercisePlanFetched, exercisePlan } = coachExercisePlanState;
        if (isExercisePlanFetched) {
          const periodData = !exercisePlan.periods.length
            ? exercisePlan.periods
            : [
                {
                  id: -1,
                  name: "",
                  info: "",
                  start_time: 1,
                  end_time: 2,
                  workouts: [],
                },
              ];

          const category = getPlanCategory(exercisePlan);
          const program = getPlanProgram(exercisePlan);

          setState({
            ...state,
            isPeriodDataLoaded: true,
            periodData: periodData,
            planID: plan_id,
            exePlanName: exercisePlan.name,
            exePlanDes: exercisePlan.info,
            selectedCategory: category,
            selectedProgram: program,
          });
        } else {
          setState({
            ...state,
            isPeriodDataLoaded: false,
            // errorMsg: this.props.coachExercisePlanState.exercisePlanListErrorMsg,
            // isLoadingExercisePlanList: false
          });
        }
      });
    }

    const { height: fHeight } = fullViewRef.current.getBoundingClientRect();
    const { height: pHeight } = periodWorkoutViewRef.current.getBoundingClientRect();

    setState({
      ...state,
      currentFullHeight: fHeight,
      currentPeriodWorkoutViewHeight: pHeight + fHeight,
      fullViewStyle: {
        maxHeight: fHeight,
        opacity: 1,
      },
      periodWorkoutViewStyle: { maxHeight: pHeight + fHeight },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coachExercisePlanState, dispatch, location, token]);

  const handleExePlanNameChange = (event) => {
    setState({ ...state, exePlanName: event.target.value });
  };

  const handleExePlanDesChange = (event) => {
    setState({ ...state, exePlanDes: event.target.value });
  };

  const handleCategorySelect = (category, value) => {
    if (category === "category") {
      setState({
        ...state,
        selectedCategory: value,
      });
    }
    if (category === "program") {
      setState({
        ...state,
        selectedProgram: value,
      });
    }
  };

  const handleGeneralInfoSave = () => {
    setState(
      {
        ...state,
        isExePlanNameEmpty: false,
        isExePlanDesEmpty: false,
        isError: false,
        missingField: "",
      },
      () => {
        if (state.exePlanName === "") {
          setState({
            ...state,
            isExePlanNameEmpty: true,
            isError: true,
            missingField: t("ExercisePlan.plan-name"),
          });
          return;
        }

        if (state.exePlanDes === "") {
          setState({
            ...state,
            isExePlanDesEmpty: true,
            isError: true,
            missingField: t("ExercisePlan.plan-desc"),
          });
          return;
        }

        //if newExercisePlanID is not -1 that means we need to update the current program instead of making a new one
        if (state.planID !== -1) {
          console.log("Updating the Current Program");
          let payload = {
            exe_plan_id: state.planID,
            name: state.exePlanName,
            info: state.exePlanDes,
            tags: "",
            locale: "",
            plan_type: state.selectedCategory,
            public: state.selectedProgram === "public",
            created_at: Date.now() / 1000,
          };
          dispatch(updateExercisePlan(token, payload)).then(() => {
            if (coachExercisePlanState.isExercisePlanUpdated) {
              console.log("exe is updated with id: ", coachExercisePlanState.newExercisePlanID);
            } else {
              console.log(
                "failed to update with: ",
                coachExercisePlanState.exercisePlanUpdateError
              );
            }
          });
        } else {
          console.log("Making A new Program");
          const payload = {
            name: state.exePlanName,
            info: state.exePlanDes,
            tags: "",
            locale: "",
            plan_type: state.selectedCategory,
            public: state.selectedProgram === "public",
            created_at: Date.now() / 1000,
          };
          dispatch(createExercisePlan(token, payload)).then(() => {
            if (coachExercisePlanState.isExercisePlanCreated) {
              console.log("exe is created with id: ", coachExercisePlanState.newExercisePlanID);
              setState({
                ...state,
                planID: coachExercisePlanState.newExercisePlanID,
              });
            } else {
              console.log(
                "failed to create with: ",
                coachExercisePlanState.exercisePlanCreationError
              );
            }
          });
        }
      }
    );
  };

  useEffect(() => {
    if (callbackRef.current) {
      callbackRef.current = false;
      return;
    }
    handleGeneralInfoSave();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.selectedCategory, state.selectedProgram]);

  return (
    <div className={style.main_container}>
      <h1 className={style.title}>{t("ExercisePlan.create-exercise-plan")}</h1>

      <p className={style.error_message} style={state.isError ? { fontSize: "1.4rem" } : {}}>
        {state.missingField} {t("ExercisePlan.is-missing")}.
      </p>

      <form className={style.form} style={state.fullViewStyle} ref={fullViewRef}>
        <div className={style.general_inputs}>
          <InputControl
            label={t("ExercisePlan.plan-name")}
            isEmpty={state.exePlanName.length < 1}
            isError={state.isExePlanNameEmpty}
            className={style.input_control}
          >
            <input
              className={style.exercise_name}
              type="text"
              value={state.exePlanName}
              onChange={(evt) => handleExePlanNameChange(evt)}
              onBlur={() => handleGeneralInfoSave()}
            />
          </InputControl>

          <InputControl
            label={t("ExercisePlan.plan-desc")}
            isEmpty={state.exePlanDes.length < 1}
            isError={state.isExePlanDesEmpty}
            centerLabel={false}
            className={style.input_control}
          >
            <textarea
              rows="5"
              className={style.exercise_description}
              value={state.exePlanDes}
              onChange={(evt) => handleExePlanDesChange(evt)}
              onBlur={() => handleGeneralInfoSave()}
            />
          </InputControl>
        </div>
        <div className={style.general_checkboxes}>
          {/*type*/}
          <div className={style.exercise_category}>
            <h1 className={style.cat_title}>{t("ExercisePlan.category")}</h1>
            <div className={style.category_options}>
              <div
                className={style.category_option}
                onClick={() => handleCategorySelect("category", "strength")}
              >
                <div
                  className={`${style.cat_checkbox} ${
                    state.selectedCategory === "strength" ? style.cat_checkbox_selected : ""
                  }`}
                />
                <h2 className={style.option_name}>{t("ExercisePlan.strength")}</h2>
              </div>

              <div
                className={`${style.category_option} ${style.center_one}`}
                onClick={() => handleCategorySelect("category", "cardio")}
              >
                <div
                  className={`${style.cat_checkbox} ${
                    state.selectedCategory === "cardio" ? style.cat_checkbox_selected : ""
                  }`}
                />
                <h2 className={style.option_name}>{t("ExercisePlan.cardio")}</h2>
              </div>

              <div
                className={`${style.category_option} ${style.center_one}`}
                onClick={() => handleCategorySelect("category", "strength & cardio")}
              >
                <div
                  className={`${style.cat_checkbox} ${
                    state.selectedCategory === "strength & cardio"
                      ? style.cat_checkbox_selected
                      : ""
                  }`}
                />
                <h2 className={style.option_name}>{t("ExercisePlan.strength-cardio")}</h2>
              </div>

              <div
                className={`${style.category_option} ${style.center_one}`}
                onClick={() => handleCategorySelect("category", "crossfit")}
              >
                <div
                  className={`${style.cat_checkbox} ${
                    state.selectedCategory === "crossfit" ? style.cat_checkbox_selected : ""
                  }`}
                />
                <h2 className={style.option_name}>{t("ExercisePlan.crossfit")}</h2>
              </div>
            </div>
          </div>

          {/*Category*/}
          <div className={style.customer_category}>
            <h1 className={style.cat_title}>Program for</h1>
            <div className={style.category_options}>
              <div
                className={style.category_option}
                onClick={() => handleCategorySelect("program", "public")}
              >
                <div
                  className={`${style.cat_checkbox} ${
                    state.selectedProgram === "public" ? style.cat_checkbox_selected : ""
                  }`}
                />
                <h2 className={style.option_name}>{t("ExercisePlan.public")}</h2>
              </div>
              <div
                className={`${style.category_option} ${style.center_one}`}
                onClick={() => handleCategorySelect("program", "customer")}
              >
                <div
                  className={`${style.cat_checkbox} ${
                    state.selectedProgram === "customer" ? style.cat_checkbox_selected : ""
                  }`}
                />
                <h2 className={style.option_name}>{t("ExercisePlan.customer")}</h2>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/*Exercise Periods*/}
      <div className={style.exercise_periods_container} ref={periodWorkoutViewRef}>
        {state.isPeriodDataLoaded && <PeriodWorkoutView data={state.periodData} />}
        {!state.isPeriodDataLoaded && <Loading loading={true} />}
      </div>
      <div
        className={style.btn_main_container}
        style={showCompactView ? { height: 0, overflow: "hidden" } : {}}
      >
        <button className={style.btn_main}>{t("ExercisePlan.save-plan")}</button>
      </div>
    </div>
  );
};
