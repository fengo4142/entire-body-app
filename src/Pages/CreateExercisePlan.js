import React, { Component } from "react";
import style from "./CreateExercisePlan.module.scss";
import PeriodWorkoutView from "./PeriodAndWorkoutView/PeriodWorkoutView";
import InputControl from "../Components/Custom/InputControl";
import { faAd } from "@fortawesome/free-solid-svg-icons/faAd";
import { faPizzaSlice } from "@fortawesome/free-solid-svg-icons/faPizzaSlice";
import { faRunning } from "@fortawesome/free-solid-svg-icons/faRunning";
import Loading from "../Components/General/Loading/Loading";
import { withTranslation } from "react-i18next";
import { bindActionCreators } from "redux";
import {
  createExercisePlan,
  updateExercisePlan,
  getExercisePlan,
} from "../Redux/Component/Coach/ExercisePlan/ExercisePlanActions";
import { connect } from "react-redux";
import * as PropTypes from "prop-types";

class CreateExercisePlan extends Component {
  constructor(props) {
    super(props);
    this.fullViewRef = React.createRef();
    this.PeriodWorkoutViewRef = React.createRef();
    this.state = {
      currentFullHeight: 0,
      currentPeriodWorkoutViewHeight: 0,
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
      inputVisible: false,
      inputValue: "",

      exePlanName: "",
      exePlanDes: "",
      selectedCategory: "strength",
      selectedProgram: "customer",
      isError: false,
      missingField: "",
      isExePlanNameEmpty: false,
      isExePlanDesEmpty: false,

      showCompactView: false,
      fullViewStyle: {
        maxHeight: 10000,
        opacity: 1,
      },
      compactViewStyle: {
        height: "5.1rem",
        opacity: 1,
        paddingTop: "1rem",
        paddingBottom: "1rem",
      },
      periodWorkoutViewStyle: {
        maxHeight: 0,
        opacity: 0,
      },
      showIconPicker: false,
      iconPickerX: -9999999,
      iconPickerY: -9999999,
      clickedOutsideIconPicker: true,
      periodData: [],
      isPeriodDataLoaded: false,
      planID: -1,
    };

    this.handleCategorySelect = this.handleCategorySelect.bind(this);
    this.handleGeneralInfoSave = this.handleGeneralInfoSave.bind(this);
    this.handleExePlanNameChange = this.handleExePlanNameChange.bind(this);
    this.handleExePlanDesChange = this.handleExePlanDesChange.bind(this);
  }

  componentDidMount() {
    //Check if the ID is -1 or undefined that means you need to make a new plan

    let planIDExists;
    let planID;

    try {
      planID = this.props.location.state.plan_id;
      planIDExists = true;
      console.log(planIDExists, planID);
    } catch {
      planIDExists = false;
      planID = -1;

      console.log("nope", planIDExists, planID);
    }

    if (!planIDExists || planID === -1) {
      //make a new plan
      this.setState({
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
    //else get the plan data from the server using the ID and send that Data to periodWorkoutView component
    // as wel ass fill in the exercise plan state
    else {
      //fetch the data from server
      let payload = {
        mode: "id",
        program_id: this.props.location.state.plan_id,
      };
      this.props.getExercisePlan(this.props.token, payload).then(() => {
        if (this.props.coachExercisePlanState.isExercisePlanFetched) {
          let periodData;
          if (
            this.props.coachExercisePlanState.exercisePlan.periods.length < 1
          ) {
            periodData = [
              {
                id: -1,
                name: "",
                info: "",
                start_time: 1,
                end_time: 2,
                workouts: [],
              },
            ];
          } else {
            periodData = this.props.coachExercisePlanState.exercisePlan.periods;
          }

          let category;
          let program;
          console.log(
            this.props.coachExercisePlanState.exercisePlan.plan_type.toUpperCase()
          );
          switch (
            this.props.coachExercisePlanState.exercisePlan.plan_type.toUpperCase()
          ) {
            case "Styrke".toUpperCase():
            case "Strength".toUpperCase():
              category = "strength";
              break;
            case "Kondisjon".toUpperCase():
            case "cardio".toUpperCase():
              category = "cardio";
              break;
            case "Styrke og kondisjon".toUpperCase():
            case "strength & cardio".toUpperCase():
              category = "strength & cardio";

              console.log(category);
              break;
            case "Crossfit".toUpperCase():
              category = "crossfit";
              break;
            default:
              category = "strength";
          }

          switch (this.props.coachExercisePlanState.exercisePlan.public) {
            case 1:
              program = "public";
              break;
            case 0:
              program = "customer";
              break;
            default:
              program = "strength";
          }

          this.setState({
            isPeriodDataLoaded: true,
            periodData: periodData,
            planID: this.props.location.state.plan_id,
            exePlanName: this.props.coachExercisePlanState.exercisePlan.name,
            exePlanDes: this.props.coachExercisePlanState.exercisePlan.info,
            selectedCategory: category,
            selectedProgram: program,
          });
        } else {
          this.setState({
            isPeriodDataLoaded: false,
            // errorMsg: this.props.coachExercisePlanState.exercisePlanListErrorMsg,
            // isLoadingExercisePlanList: false
          });
        }
      });
    }

    this.setState({
      currentFullHeight: this.fullViewRef.current.getBoundingClientRect()
        .height,
      currentPeriodWorkoutViewHeight:
        this.PeriodWorkoutViewRef.current.getBoundingClientRect().height +
        this.fullViewRef.current.getBoundingClientRect().height,
      fullViewStyle: {
        maxHeight: this.fullViewRef.current.getBoundingClientRect().height,
        opacity: 1,
      },
      periodWorkoutViewStyle: {
        maxHeight:
          this.PeriodWorkoutViewRef.current.getBoundingClientRect().height +
          this.fullViewRef.current.getBoundingClientRect().height,
      },
    });
  }

  handleExePlanNameChange(event) {
    this.setState({ exePlanName: event.target.value });
  }

  handleExePlanDesChange(event) {
    this.setState({ exePlanDes: event.target.value });
  }

  handleCategorySelect = (category, value) => {
    if (category === "category") {
      this.setState(
        {
          selectedCategory: value,
        },
        () => {
          this.handleGeneralInfoSave();
        }
      );
    } else if (category === "program") {
      this.setState(
        {
          selectedProgram: value,
        },
        () => {
          this.handleGeneralInfoSave();
        }
      );
    }
  };

  handleGeneralInfoSave = () => {
    this.setState(
      {
        isExePlanNameEmpty: false,
        isExePlanDesEmpty: false,
        isError: false,
        missingField: "",
      },
      () => {
        if (this.state.exePlanName === "") {
          this.setState({
            isExePlanNameEmpty: true,
            isError: true,
            missingField: this.props.t("ExercisePlan.plan-name"),
          });
          return;
        }

        if (this.state.exePlanDes === "") {
          this.setState({
            isExePlanDesEmpty: true,
            isError: true,
            missingField: this.props.t("ExercisePlan.plan-desc"),
          });
          return;
        }

        //if newExercisePlanID is not -1 that means we need to update the current program instead of making a new one
        if (this.state.planID !== -1) {
          console.log("Updating the Current Program");
          let payload = {
            exe_plan_id: this.state.planID,
            name: this.state.exePlanName,
            info: this.state.exePlanDes,
            tags: "",
            locale: "",
            plan_type: this.state.selectedCategory,
            public: this.state.selectedProgram === "public",
            created_at: Date.now() / 1000,
          };
          this.props.updateExercisePlan(this.props.token, payload).then(() => {
            if (this.props.coachExercisePlanState.isExercisePlanUpdated) {
              console.log(
                "exe is updated with id: ",
                this.props.coachExercisePlanState.newExercisePlanID
              );
            } else {
              console.log(
                "failed to update with: ",
                this.props.coachExercisePlanState.exercisePlanUpdateError
              );
            }
          });
        } else {
          console.log("Making A new Program");
          let payload = {
            name: this.state.exePlanName,
            info: this.state.exePlanDes,
            tags: "",
            locale: "",
            plan_type: this.state.selectedCategory,
            public: this.state.selectedProgram === "public",
            created_at: Date.now() / 1000,
          };
          this.props.createExercisePlan(this.props.token, payload).then(() => {
            if (this.props.coachExercisePlanState.isExercisePlanCreated) {
              console.log(
                "exe is created with id: ",
                this.props.coachExercisePlanState.newExercisePlanID
              );
              this.setState({
                planID: this.props.coachExercisePlanState.newExercisePlanID,
              });
            } else {
              console.log(
                "failed to create with: ",
                this.props.coachExercisePlanState.exercisePlanCreationError
              );
            }
          });
        }
      }
    );
  };

  render() {
    const { t } = this.props;
    return (
      <div className={style.main_container}>
        <h1 className={style.title}>
          {t("ExercisePlan.create-exercise-plan")}
        </h1>

        <p
          className={style.error_message}
          style={this.state.isError ? { fontSize: "1.4rem" } : {}}
        >
          {this.state.missingField} {t("ExercisePlan.is-missing")}.
        </p>

        <form
          className={style.form}
          style={this.state.fullViewStyle}
          ref={this.fullViewRef}
        >
          <div className={style.general_inputs}>
            <InputControl
              label={t("ExercisePlan.plan-name")}
              isEmpty={this.state.exePlanName.length < 1}
              isError={this.state.isExePlanNameEmpty}
              className={style.input_control}
            >
              <input
                className={style.exercise_name}
                type="text"
                value={this.state.exePlanName}
                onChange={(evt) => this.handleExePlanNameChange(evt)}
                onBlur={() => this.handleGeneralInfoSave()}
              />
            </InputControl>

            <InputControl
              label={t("ExercisePlan.plan-desc")}
              isEmpty={this.state.exePlanDes.length < 1}
              isError={this.state.isExePlanDesEmpty}
              centerLabel={false}
              className={style.input_control}
            >
              <textarea
                rows="5"
                className={style.exercise_description}
                value={this.state.exePlanDes}
                onChange={(evt) => this.handleExePlanDesChange(evt)}
                onBlur={() => this.handleGeneralInfoSave()}
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
                  onClick={() =>
                    this.handleCategorySelect("category", "strength")
                  }
                >
                  <div
                    className={`${style.cat_checkbox} ${
                      this.state.selectedCategory === "strength"
                        ? style.cat_checkbox_selected
                        : ""
                    }`}
                  />
                  <h2 className={style.option_name}>
                    {t("ExercisePlan.strength")}
                  </h2>
                </div>

                <div
                  className={`${style.category_option} ${style.center_one}`}
                  onClick={() =>
                    this.handleCategorySelect("category", "cardio")
                  }
                >
                  <div
                    className={`${style.cat_checkbox} ${
                      this.state.selectedCategory === "cardio"
                        ? style.cat_checkbox_selected
                        : ""
                    }`}
                  />
                  <h2 className={style.option_name}>
                    {t("ExercisePlan.cardio")}
                  </h2>
                </div>

                <div
                  className={`${style.category_option} ${style.center_one}`}
                  onClick={() =>
                    this.handleCategorySelect("category", "strength & cardio")
                  }
                >
                  <div
                    className={`${style.cat_checkbox} ${
                      this.state.selectedCategory === "strength & cardio"
                        ? style.cat_checkbox_selected
                        : ""
                    }`}
                  />
                  <h2 className={style.option_name}>
                    {t("ExercisePlan.strength-cardio")}
                  </h2>
                </div>

                <div
                  className={`${style.category_option} ${style.center_one}`}
                  onClick={() =>
                    this.handleCategorySelect("category", "crossfit")
                  }
                >
                  <div
                    className={`${style.cat_checkbox} ${
                      this.state.selectedCategory === "crossfit"
                        ? style.cat_checkbox_selected
                        : ""
                    }`}
                  />
                  <h2 className={style.option_name}>
                    {t("ExercisePlan.crossfit")}
                  </h2>
                </div>
              </div>
            </div>

            {/*Category*/}
            <div className={style.customer_category}>
              <h1 className={style.cat_title}>Program for</h1>
              <div className={style.category_options}>
                <div
                  className={style.category_option}
                  onClick={() => this.handleCategorySelect("program", "public")}
                >
                  <div
                    className={`${style.cat_checkbox} ${
                      this.state.selectedProgram === "public"
                        ? style.cat_checkbox_selected
                        : ""
                    }`}
                  />
                  <h2 className={style.option_name}>
                    {t("ExercisePlan.public")}
                  </h2>
                </div>
                <div
                  className={`${style.category_option} ${style.center_one}`}
                  onClick={() =>
                    this.handleCategorySelect("program", "customer")
                  }
                >
                  <div
                    className={`${style.cat_checkbox} ${
                      this.state.selectedProgram === "customer"
                        ? style.cat_checkbox_selected
                        : ""
                    }`}
                  />
                  <h2 className={style.option_name}>
                    {t("ExercisePlan.customer")}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/*Exercise Periods*/}
        <div
          className={style.exercise_periods_container}
          ref={this.PeriodWorkoutViewRef}
        >
          {this.state.isPeriodDataLoaded && (
            <PeriodWorkoutView data={this.state.periodData} />
          )}
          {!this.state.isPeriodDataLoaded && <Loading loading={true} />}
        </div>
        <div
          className={style.btn_main_container}
          style={
            this.state.showCompactView ? { height: 0, overflow: "hidden" } : {}
          }
        >
          <button className={style.btn_main}>
            {t("ExercisePlan.save-plan")}
          </button>
        </div>
      </div>
    );
  }
}

CreateExercisePlan.propTypes = {
  createExercisePlan: PropTypes.element.isRequired && PropTypes.func,
  updateExercisePlan: PropTypes.element.isRequired && PropTypes.func,
  getExercisePlan: PropTypes.element.isRequired && PropTypes.func,
  coachExercisePlanState: PropTypes.element.isRequired && PropTypes.object,
  token: PropTypes.element.isRequired && PropTypes.string,
  location: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    coachExercisePlanState: state.coachState.coachExercisePlanState,
    token: state.userState.user.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    { createExercisePlan, updateExercisePlan, getExercisePlan },
    dispatch
  );
};

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(React.memo(CreateExercisePlan))
);
