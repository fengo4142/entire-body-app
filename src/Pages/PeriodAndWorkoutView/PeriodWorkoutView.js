import React, { Component } from "react";
import style from "./PeriodWorkoutView.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleRight,
  faArrowAltCircleDown,
  faArrowAltCircleUp,
  faCopy,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import InputControl from "../../Components/Custom/InputControl";
import Dropdown from "../../Components/Custom/Dropdown";
import { withTranslation } from "react-i18next";
import { bindActionCreators } from "redux";
import {
  createPeriod,
  updatePeriod,
  deletePeriod,
  createWorkout,
  updateWorkout,
  updateWorkoutOrder,
  deleteWorkout,
  getExerciseListForDropDown,
  createExercise,
  updateExercise,
  deleteExercise,
  duplicateExerciseResources,
} from "../../Redux/Component/Coach/ExercisePlan/ExercisePlanActions";
import ExerciseForm from "../../Components/ExercisePlan/ExerciseForm";
import { connect } from "react-redux";
import * as PropTypes from "prop-types";
import YouTube from "react-youtube";

class PeriodWorkoutView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //Exercise Info
      showExerciseInfoPopup: false,
      exerciseInfoObject: {},
      //END
      showAddInfoPopup: false,
      addExeInfo: "",
      exeInfoPeriodIndex: -1,
      exeInfoWorkoutIndex: -1,
      exeInfoExerciseIndex: -1,
      // These are used to update the exe from the list
      shouldUpdateExeOnServer: false,
      exePeriodIndex: -1,
      exeWorkoutIndex: -1,
      exeExerciseIndex: -1,
      // END
      newExeIDSelected: -10,
      errorLocation: "",
      noPeriodsFound: false,

      isAddPeriodButtonPressed: false,
      showWorkoutFormForThePeriod: -1,
      showPeriodForm: false,
      showWorkoutForm: false,
      showExerciseForm: false,
      addExerciseToWorkoutIndex: "",
      periodCollapseIndex: [],
      workoutCollapseIndex: [],
      selectedPeriodIndex: "",
      selectedWorkoutIndex: "",
      selectedExerciseIndex: "",
      nestedSelectedPeriodIndex: "",
      nestedSelectedWorkoutIndex: "",
      nestedSelectedExerciseIndex: "",
      currentOver: -1,
      currentDragged: -1,
      heightStyle: [],
      workoutHeightStyle: {},
      // Error
      missingField: "",
      isError: false,
      //Period
      newPeriodName: "",
      newPeriodDesc: "",
      isNewPeriodNameEmpty: false,
      isNewPeriodDesEmpty: false,
      isNewPeriodStartEmpty: false,
      isNewPeriodEndEmpty: false,
      //workout
      newWorkoutName: "",
      newWorkoutDesc: "",
      isNewWorkoutNameEmpty: false,
      isNewWorkOutDescEmpty: false,
      //exercise
      selectedExercise: -1,
      createNewExeMaxHeight: 0,
      isCreatingNewExerciseResource: false,
      exerciseSets: "",
      exerciseReps: "",
      exerciseTag: "",
      exerciseInfo: "",
      exerciseResistance: "",
      exerciseRest: "",
      newExerciseName: "",
      newExerciseDesc: "",
      newExerciseVideoLink: "",
      isExerciseNotSelected: false,
      isEmptySets: false,
      isEmptyReps: false,
      isEmptyTag: false,
      isEmptyInfo: false,
      isEmptyResistance: false,
      isEmptyRest: false,
      isEmptyNewExerciseName: false,
      isEmptyNewExerciseDesc: false,
      periodList: [],
      exerciseList: [],
      // Video options
      videoOpts: {
        height: "390",
        width: "640",
        playerVars: {
          autoplay: 0,
        },
      },
    };

    this.createNewExeRef = React.createRef();
    this.workoutNameRef = React.createRef();
    this.workoutHeaderRef = React.createRef();
    this.periodRef = [];

    this.handlePeriodCollapse = this.handlePeriodCollapse.bind(this);
    this.handleWorkoutCollapse = this.handleWorkoutCollapse.bind(this);
    this.handleCollapseAll = this.handleCollapseAll.bind(this);
    this.handleCreateNewWorkout = this.handleCreateNewWorkout.bind(this);
    this.handleCreateNewExercise = this.handleCreateNewExercise.bind(this);
    this.handleExerciseSelect = this.handleExerciseSelect.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handlePeriod = this.handlePeriod.bind(this);
    this.handleDeletePeriod = this.handleDeletePeriod.bind(this);
    this.handleAddWorkoutToPeriod = this.handleAddWorkoutToPeriod.bind(this);
    this.handleDeleteWorkout = this.handleDeleteWorkout.bind(this);
    this.handleAddExerciseToWorkout = this.handleAddExerciseToWorkout.bind(this);
    this.handlePeriodDuplicate = this.handlePeriodDuplicate.bind(this);
    this.handleWorkoutDuplicate = this.handleWorkoutDuplicate.bind(this);
    this.handleExerciseSelectUpdate = this.handleExerciseSelectUpdate.bind(this);
    this.handleExerciseDuplicate = this.handleExerciseDuplicate.bind(this);
    this.handleDeleteExercise = this.handleDeleteExercise.bind(this);
    this.handlePeriodCancel = this.handlePeriodCancel.bind(this);
    this.handleShowPeriod = this.handleShowPeriod.bind(this);
    this.handleWorkoutCancel = this.handleWorkoutCancel.bind(this);
    this.handleShowWorkoutForm = this.handleShowWorkoutForm.bind(this);
    this.handleShowExerciseForm = this.handleShowExerciseForm.bind(this);
    this.handleExerciseCancel = this.handleExerciseCancel.bind(this);
    this.handleAddInfoClick = this.handleAddInfoClick.bind(this);
    this.handlePopupClose = this.handlePopupClose.bind(this);
    this.handleAddInfoBlur = this.handleAddInfoBlur.bind(this);
    this.handleExerciseInfoClick = this.handleExerciseInfoClick.bind(this);
    this.handleOrderChange = this.handleOrderChange.bind(this);
    this.getVideoID = this.getVideoID.bind(this);
    this.handleVideoReady = this.handleVideoReady.bind(this);
  }

  componentDidMount() {
    if (this.props.data) {
      this.setState(
        {
          periodList: this.props.data,
          noPeriodsFound: this.props.data[0].id === -1,
        },
        () => {
          this.setState({
            newPeriodName: "",
            newPeriodDesc: "",
            selectedPeriodIndex: "",
          });
        }
      );
    } else {
      console.log("no data in props");
    }
    // this.props.getExerciseListForDropDown(this.props.token).then(() => {
    //   if (this.props.coachExercisePlanState.isExerciseListFetched) {
    //     this.setState({
    //       exerciseList: this.props.coachExercisePlanState.exerciseList,
    //     });
    //   } else {
    //     console.log(
    //       "exe list fetch failed with: ",
    //       this.props.coachExercisePlanState.exerciseListFetchError
    //     );
    //   }
    // });
    this.handleCollapseAll();
  }

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.exerciseList.length !== this.state.exerciseList.length) {
      this.props.getExerciseListForDropDown(this.props.token).then(() => {
        if (this.props.coachExercisePlanState.isExerciseListFetched) {
          this.setState({
            exerciseList: this.props.coachExercisePlanState.exerciseList,
          });
        } else {
          console.log(
            "updating exe list failed with: ",
            this.props.coachExercisePlanState.exerciseListFetchError
          );
        }
      });
    }
  }

  handleAddInfoClick = (isNewForm, exe, periodIndex, workoutIndex, exerciseIndex) => {
    if (!isNewForm) {
      this.setState({
        showAddInfoPopup: true,
        addExeInfo: exe.info,
        exeInfoPeriodIndex: periodIndex,
        exeInfoWorkoutIndex: workoutIndex,
        exeInfoExerciseIndex: exerciseIndex,
      });
      return;
    }

    this.setState({
      showAddInfoPopup: true,
      exeInfoPeriodIndex: periodIndex,
      exeInfoWorkoutIndex: workoutIndex,
      exeInfoExerciseIndex: exerciseIndex,
      addExeInfo: "",
    });
  };

  handleAddInfoBlur = (e) => {
    if (this.state.exeInfoExerciseIndex === -1) {
      this.handleAddExerciseToWorkout(
        e,
        this.state.exeInfoWorkoutIndex,
        this.state.exeInfoPeriodIndex,
        this.state.exeInfoExerciseIndex,
        false,
        false
      );
    } else {
      this.handleAddExerciseToWorkout(
        e,
        this.state.exeInfoWorkoutIndex,
        this.state.exeInfoPeriodIndex,
        this.state.exeInfoExerciseIndex,
        false,
        true
      );
    }
  };

  handlePopupClose = () => {
    this.setState({
      showAddInfoPopup: false,
      showExerciseInfoPopup: false,
      exerciseInfoObject: {},
    });
  };

  handlePeriodDuplicate = (e, periodIndex) => {
    e.preventDefault();
    e.stopPropagation();

    let payload = {
      mode: "period",
      program_id: this.props.coachExercisePlanState.newExercisePlanID,
      period_id: this.state.periodList[periodIndex].id,
    };

    this.props.duplicateExerciseResources(this.props.token, payload).then(() => {
      if (this.props.coachExercisePlanState.isDuplicateSuccess) {
        console.log(this.props.coachExercisePlanState.duplicatedResponse, "dupe");
        let newPeriod = this.props.coachExercisePlanState.duplicatedResponse;
        this.setState({
          periodList: [...this.state.periodList, newPeriod],
        });
      } else {
        console.log("duplication failed");
      }
    });
  };

  handleWorkoutDuplicate = (e, periodIndex, workoutIndex) => {
    e.preventDefault();
    e.stopPropagation();

    let targetPeriod = this.state.periodList[periodIndex];
    let duplicateWorkout = targetPeriod.workouts[workoutIndex];

    let newWorkout = {
      mode: "workout",
      workout_id: duplicateWorkout.id,
      period_id: targetPeriod.id,
      name: duplicateWorkout.name,
      info: duplicateWorkout.info,
      created_at: Date.now() / 1000,
      workout_number: duplicateWorkout.workout_number + 1,
      schedule_time: 1,
    };

    this.props.duplicateExerciseResources(this.props.token, newWorkout).then(() => {
      if (this.props.coachExercisePlanState.isDuplicateSuccess) {
        let tmpWorkout = this.props.coachExercisePlanState.duplicatedResponse;
        let targetPeriod = this.state.periodList[periodIndex];
        targetPeriod.workouts = [...this.state.periodList[periodIndex].workouts, tmpWorkout];
        let newPeriodList = this.state.periodList;
        newPeriodList[periodIndex] = targetPeriod;

        this.setState({
          periodList: newPeriodList,
        });
      } else {
        console.log("workout duplicate failed ");
      }
    });
  };

  handleExerciseDuplicate = (e, periodIndex, workoutIndex, exerciseIndex) => {
    e.preventDefault();
    e.stopPropagation();
    let targetExercise = this.state.periodList[periodIndex].workouts[workoutIndex].exercises[
      exerciseIndex
    ];

    let payload = {
      exercise_id: targetExercise.exercise_id,
      workout_id: targetExercise.workout_id,
      tag: "",
      sets: targetExercise.sets,
      reps: targetExercise.reps,
      resistance: targetExercise.resistance,
      rest: targetExercise.rest,
      info: targetExercise.info,
      order: this.state.periodList[periodIndex].workouts[workoutIndex].exercises.length + 1,
      created_at: Date.now() / 1000,
    };

    this.props.createExercise(this.props.token, payload).then(() => {
      if (this.props.coachExercisePlanState.isExerciseCreated) {
        let targetedExercises = [
          ...this.state.periodList[periodIndex].workouts[workoutIndex].exercises,
          this.props.coachExercisePlanState.exercise,
        ];
        let tmpList = this.state.periodList;
        tmpList[periodIndex].workouts[workoutIndex].exercises = targetedExercises;
        this.setState({
          periodList: tmpList,
          showExerciseForm: false,
          addExerciseToWorkoutIndex: "",
          exerciseSets: "",
          exerciseReps: "",
          exerciseRest: "",
          selectedExercise: -1,
          addExeInfo: "",
        });
      } else {
        console.log(
          "exercise is failed with: ",
          this.props.coachExercisePlanState.exerciseCreationError
        );
        this.setState({
          isEmptySets: true,
          isError: true,
        });
      }
    });
  };

  handlePeriod = (periodIndex, isButtonClicked) => {
    if (this.state.periodList[this.state.periodList.length - 1].id === -1 && isButtonClicked) {
      if (this.state.newPeriodName === "") {
        this.setState({
          isNewPeriodNameEmpty: true,
          isError: true,
          errorLocation: 0,
        });
        return;
      }
    }

    if (isButtonClicked) {
      if (!this.state.showPeriodForm) {
        this.setState({
          newPeriodName: "",
          newPeriodDesc: "",
          showPeriodForm: true,
          isAddPeriodButtonPressed: true,
          errorLocation: "",
        });
        return;
      }
    }

    //update the period if there is any period index is provided
    if (periodIndex !== -1 && this.state.periodList[periodIndex].id !== -1) {
      if (this.state.periodList[periodIndex].name === "") {
        this.setState({
          isError: true,
          errorLocation: periodIndex,
        });
        return;
      }

      let payload = {
        period_id: this.state.periodList[periodIndex].id,
        name: this.state.periodList[periodIndex].name,
        info: this.state.periodList[periodIndex].info,
      };
      this.props.updatePeriod(this.props.token, payload).then(() => {
        if (this.props.coachExercisePlanState.isExercisePeriodUpdated) {
          console.log("");
        } else {
          console.log(
            "period update failed with: ",
            this.props.coachExercisePlanState.exercisePeriodUpdateError
          );
        }
      });
    }
    // CREATE A NEW PERIOD IN THE GIVEN PROGRAM
    else {
      // if ADD NEW PERIOD BUTTON PRESSED. MEANING YOU ARE NOT EDITING ANY PERIOD FROM THE PERIOD LIST INCLUDING THE FIRST DUMMY PERIOD
      if (this.state.isAddPeriodButtonPressed) {
        this.setState(
          {
            isError: false,
            isNewPeriodNameEmpty: false,
          },
          () => {
            if (this.state.newPeriodName === "") {
              this.setState({
                isNewPeriodNameEmpty: true,
                isError: true,
              });
              return;
            }

            let payload = {
              program_id: this.props.coachExercisePlanState.newExercisePlanID,
              name: this.state.newPeriodName,
              info: this.state.newPeriodDesc,
              start_time: this.state.periodList.length + 1,
              end_time: 0,
              created_at: Date.now() / 1000,
            };

            this.props.createPeriod(this.props.token, payload).then(() => {
              if (this.props.coachExercisePlanState.isExercisePeriodCreated) {
                let newPeriod = {
                  id: this.props.coachExercisePlanState.exercisePeriodID,
                  name: this.state.newPeriodName,
                  info: this.state.newPeriodDesc,
                  start_time: this.state.periodList.length + 1,
                  end_time: 0,
                  workouts: [],
                };

                this.setState(
                  {
                    periodList: [...this.state.periodList, newPeriod],
                    showPeriodForm: false,
                  },
                  () => {
                    this.setState({
                      newPeriodName: "",
                      newPeriodDesc: "",
                      selectedPeriodIndex: "",
                      isAddPeriodButtonPressed: false,
                    });
                  }
                );
              } else {
                console.log(
                  "period creation failed with: ",
                  this.props.coachExercisePlanState.exercisePeriodCreationError
                );
              }
            });
          }
        );
      }
      // ELSE YOU ARE UPDATING THE VERY FIRST PERIOD THAT IS STILL NOT CREATED IN THE DATABASE
      else {
        this.setState(
          {
            isNewPeriodNameEmpty: false,
            isError: false,
          },
          () => {
            if (this.state.periodList[periodIndex].name === "") {
              this.setState({
                isNewPeriodNameEmpty: true,
                isError: true,
              });
              return;
            }

            let payload = {
              program_id: this.props.coachExercisePlanState.newExercisePlanID,
              name: this.state.periodList[periodIndex].name,
              info: this.state.periodList[periodIndex].info,
              start_time: this.state.periodList.length + 1,
              end_time: 0,
              created_at: Date.now() / 1000,
            };

            this.props.createPeriod(this.props.token, payload).then(() => {
              if (this.props.coachExercisePlanState.isExercisePeriodCreated) {
                let newPeriod = {
                  id: this.props.coachExercisePlanState.exercisePeriodID,
                  name: this.state.periodList[periodIndex].name,
                  info: this.state.periodList[periodIndex].info,
                  start_time: this.state.periodList.length + 1,
                  end_time: 0,
                  workouts: [],
                };

                let tmpList = this.state.periodList;
                tmpList[periodIndex] = newPeriod;

                this.setState(
                  {
                    periodList: tmpList,
                    showPeriodForm: false,
                  },
                  () => {
                    this.setState({
                      newPeriodName: "",
                      newPeriodDesc: "",
                      selectedPeriodIndex: "",
                      noPeriodsFound: false,
                    });
                  }
                );
              } else {
                console.log(
                  "1st period creation failed with: ",
                  this.props.coachExercisePlanState.exercisePeriodCreationError
                );
              }
            });
          }
        );
      }
    }
  };

  handlePeriodCancel = () => {
    this.setState({
      showPeriodForm: false,
      isAddPeriodButtonPressed: false,
    });
  };

  handleWorkoutCancel = () => {
    this.setState({
      showWorkoutForm: false,
    });
  };

  handleExerciseCancel = () => {
    this.setState({
      showExerciseForm: false,
    });
  };

  handleShowPeriod = () => {
    this.setState({
      showPeriodForm: true,
      isAddPeriodButtonPressed: true,
    });
  };

  handleShowWorkoutForm = (periodIndex) => {
    this.setState({
      showWorkoutForm: true,
      showWorkoutFormForThePeriod: periodIndex,
    });
  };

  handleShowExerciseForm = (periodIndex, workoutIndex) => {
    this.setState({
      showExerciseForm: true,
      addExerciseToWorkoutIndex: periodIndex + "-" + workoutIndex,
    });
  };

  handleDeletePeriod = (e, periodIndex) => {
    e.preventDefault();
    e.stopPropagation();

    if (periodIndex !== -1 && this.state.periodList[periodIndex].id !== -1) {
      let payload = {
        period_id: this.state.periodList[periodIndex].id,
      };

      this.props.deletePeriod(this.props.token, payload).then(() => {
        if (this.props.coachExercisePlanState.isExercisePeriodDeleted) {
          if (this.state.periodList.length === 1) {
            this.setState({
              noPeriodsFound: true,
              periodList: [
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
          } else {
            let tmpList = this.state.periodList;
            tmpList.splice(periodIndex, 1);
            this.setState({
              periodList: tmpList,
            });
          }
        } else {
          console.log(
            "period deletion failed with: ",
            this.props.coachExercisePlanState.exercisePeriodDeleteError
          );
        }
      });
    }
  };

  handleAddWorkoutToPeriod = (
    e,
    periodIndex,
    workoutIndex,
    isOnBlurCalled,
    isCalledByCreateExerciseButton,
    isUpdating,
    calledBy = ""
  ) => {
    if (!this.state.showWorkoutForm && !isUpdating) {
      this.setState({
        showWorkoutForm: true,
        showWorkoutFormForThePeriod: periodIndex,
      });
      return;
    }

    //UPDATE IF NEEDED
    if (isUpdating) {
      //
      let payload = {
        name: this.state.periodList[periodIndex].workouts[workoutIndex].name,
        info: this.state.periodList[periodIndex].workouts[workoutIndex].info,
        workout_id: this.state.periodList[periodIndex].workouts[workoutIndex].id,
      };

      this.props.updateWorkout(this.props.token, payload).then(() => {
        if (this.props.coachExercisePlanState.isExerciseWorkoutUpdated) {
          console.log(calledBy);
        } else {
          console.log("failed to update workout");
        }
      });
    }
    // CREATE A NEW WORKOUT
    else {
      this.setState(
        {
          isError: false,
          isNewWorkoutNameEmpty: false,
        },
        () => {
          if (this.state.newWorkoutName === "") {
            this.setState({
              isNewWorkoutNameEmpty: true,
              isError: true,
            });
            return;
          }

          let newWorkout = {
            name: this.state.newWorkoutName,
            info: this.state.newWorkoutDesc,
            created_at: Date.now() / 1000,
            period_id: this.state.periodList[periodIndex].id,
            workout_number: this.state.periodList[periodIndex].workouts.length,
            schedule_time: 1,
          };

          this.props.createWorkout(this.props.token, newWorkout).then(() => {
            if (this.props.coachExercisePlanState.isExerciseWorkoutCreated) {
              let tmpWorkout = this.props.coachExercisePlanState.exerciseWorkOut;
              tmpWorkout["exercises"] = [];

              let targetPeriod = this.state.periodList[periodIndex];

              targetPeriod.workouts = [...this.state.periodList[periodIndex].workouts, tmpWorkout];
              let newPeriodList = this.state.periodList;

              newPeriodList[periodIndex] = targetPeriod;

              // this.setState({
              //     periodList: newPeriodList,
              //     showWorkoutForm: false
              // })

              if (isOnBlurCalled) {
                this.setState(
                  {
                    periodList: newPeriodList,
                    showWorkoutForm: false,
                    showWorkoutFormForThePeriod: -1,
                  },
                  () => {
                    this.setState({
                      newWorkoutName: "",
                      newWorkoutDesc: "",
                    });
                  }
                );
              } else {
                this.setState(
                  {
                    periodList: newPeriodList,
                    showWorkoutForm: false,
                    showWorkoutFormForThePeriod: -1,
                  },
                  () => {
                    this.setState({
                      newWorkoutName: "",
                      newWorkoutDesc: "",
                    });
                  }
                );
              }

              if (isCalledByCreateExerciseButton) {
                this.setState({
                  addExerciseToWorkoutIndex: periodIndex + "-" + workoutIndex,
                  showWorkoutForm: false,
                  showWorkoutFormForThePeriod: -1,
                  showExerciseForm: true,
                });
              }
            } else {
              console.log(
                "workout creation failed with",
                this.props.coachExercisePlanState.exerciseWorkoutCreationError
              );
            }
          });
        }
      );
    }
  };

  handleDeleteWorkout = (e, periodIndex, workoutIndex) => {
    e.preventDefault();
    e.stopPropagation();

    if (periodIndex !== -1 && workoutIndex !== -1) {
      let payload = {
        workout_id: this.state.periodList[periodIndex].workouts[workoutIndex].id,
      };
      this.props.deleteWorkout(this.props.token, payload).then(() => {
        if (this.props.coachExercisePlanState.isExerciseWorkoutDeleted) {
          console.log("the workout is deleted");
          let tmpWorkoutList = this.state.periodList[periodIndex].workouts;
          tmpWorkoutList.splice(workoutIndex, 1);

          let newPeriodList = this.state.periodList;
          newPeriodList[periodIndex].workouts = tmpWorkoutList;
          this.setState({
            periodList: newPeriodList,
          });
        } else {
          console.log(
            "workout delete failed with: ",
            this.props.coachExercisePlanState.exercisePeriodDeleteError
          );
        }
      });
    }
  };

  handleDeleteExercise = (e, periodIndex, workoutIndex, exerciseIndex) => {
    e.preventDefault();
    e.stopPropagation();

    if (periodIndex !== -1 && workoutIndex !== -1 && exerciseIndex !== -1) {
      let payload = {
        id: this.state.periodList[periodIndex].workouts[workoutIndex].exercises[exerciseIndex].id,
      };

      this.props.deleteExercise(this.props.token, payload).then(() => {
        if (this.props.coachExercisePlanState.isExerciseDeleted) {
          //Get the list of exe
          let tmpExeList = this.state.periodList[periodIndex].workouts[workoutIndex].exercises;
          //remove the one that is deleted
          tmpExeList.splice(exerciseIndex, 1);
          //get list of workouts
          let tmpWorkoutList = this.state.periodList[periodIndex].workouts;
          //replace the workout exercises with the new one
          tmpWorkoutList[workoutIndex].exercises = tmpExeList;

          console.log(tmpWorkoutList);

          //Get the list of periods
          let newPeriodList = this.state.periodList;
          //replace the workouts
          newPeriodList[periodIndex].workouts = tmpWorkoutList;

          this.setState({
            periodList: newPeriodList,
          });
        } else {
          console.log(
            "exe delete failed with: ",
            this.props.coachExercisePlanState.exerciseDeleteError
          );
        }
      });
    }
  };

  handleAddExerciseToWorkout = (
    e,
    workoutIndex,
    periodIndex,
    exerciseIndex,
    isNewWorkoutCreated,
    isUpdating
  ) => {
    if (!this.state.showExerciseForm && !isUpdating) {
      this.setState({
        showExerciseForm: true,
        addExerciseToWorkoutIndex: periodIndex + "-" + workoutIndex,
      });
      return;
    }

    if (!isUpdating) {
      console.log("not updating", this.state.selectedExercise);
      this.setState(
        {
          addExerciseToWorkoutIndex: periodIndex + "-" + workoutIndex,
          isError: false,
          isEmptySets: false,
        },
        () => {
          if (this.state.exerciseSets === "") {
            this.setState({
              isEmptySets: true,
              isError: true,
              showAddInfoPopup: false,
              missingField: "Sets ",
            });
            return;
          }
          if (this.state.selectedExercise === -1) {
            this.setState({
              isExerciseNotSelected: true,
              isError: true,
              showAddInfoPopup: false,
              missingField: "Exercise  ",
            });
            return;
          }

          let workoutID = this.state.periodList[periodIndex].workouts[workoutIndex].id;

          let payload = {
            exercise_id: this.state.selectedExercise,
            workout_id: workoutID,
            tag: "",
            sets: this.state.exerciseSets,
            reps: this.state.exerciseReps,
            resistance: this.state.exerciseResistance,
            rest: this.state.exerciseRest,
            info: this.state.addExeInfo,
            order: this.state.periodList[periodIndex].workouts[workoutIndex].exercises.length + 1,
            created_at: Date.now() / 1000,
          };

          this.props.createExercise(this.props.token, payload).then(() => {
            if (this.props.coachExercisePlanState.isExerciseCreated) {
              let targetedExercises = [
                ...this.state.periodList[periodIndex].workouts[workoutIndex].exercises,
                this.props.coachExercisePlanState.exercise,
              ];
              let tmpList = this.state.periodList;
              tmpList[periodIndex].workouts[workoutIndex].exercises = targetedExercises;
              this.setState({
                periodList: tmpList,
                showExerciseForm: false,
                addExerciseToWorkoutIndex: "",
                exerciseSets: "",
                exerciseReps: "",
                exerciseRest: "",
                exerciseInfo: "",
                selectedExercise: -1,
                newExeIDSelected: -10,
                showAddInfoPopup: false,
                addExeInfo: "",
              });
            } else {
              console.log(
                "exercise is failed with: ",
                this.props.coachExercisePlanState.exerciseCreationError
              );
              this.setState({
                isEmptySets: true,
                isError: true,
              });
            }
          });
        }
      );
    } else if (isUpdating) {
      let updatedExe = this.state.periodList[periodIndex].workouts[workoutIndex].exercises[
        exerciseIndex
      ];
      let payload = {
        id: updatedExe.id,
        exercise_id: updatedExe.exercise_id,
        workout_id: this.state.periodList[periodIndex].workouts[workoutIndex].id,
        sets: parseInt(updatedExe.sets),
        reps: updatedExe.reps,
        rest: updatedExe.rest,
        info: updatedExe.info,
        order: updatedExe.order,
      };
      this.props.updateExercise(this.props.token, payload).then(() => {
        if (this.props.coachExercisePlanState.isExerciseUpdated) {
          console.log("exercise is updated");
          this.setState({
            showAddInfoPopup: false,
          });
        } else {
          console.log(
            "exercise update failed with: ",
            this.props.coachExercisePlanState.exerciseUpdateError
          );
        }
      });
    }
  };

  handlePeriodCollapse(index) {
    let temp;
    if (this.state.periodCollapseIndex.includes(index)) {
      temp = this.state.periodCollapseIndex.filter((item) => item !== index);
    } else {
      temp = [...this.state.periodCollapseIndex, index];
    }

    let tmp = this.state.heightStyle;

    tmp[index] = {
      maxHeight: this.periodRef[index].clientHeight,
      overflow: "hidden",
    };

    this.setState({
      periodCollapseIndex: temp,
      heightStyle: tmp,
    });
  }

  handleWorkoutCollapse(periodIndex, workoutIndex) {
    let index = periodIndex + "-" + workoutIndex;
    let temp;
    if (this.state.workoutCollapseIndex.includes(index)) {
      temp = this.state.workoutCollapseIndex.filter((item) => item !== index);
    } else {
      temp = [...this.state.workoutCollapseIndex, index];
    }

    // let tmp = this.state.workoutHeightStyle
    //
    // tmp[index] =

    this.setState({
      workoutCollapseIndex: temp,
      workoutHeightStyle: {
        maxHeight: this.workoutHeaderRef.current.clientHeight,
        overflow: "hidden",
      },
    });
  }

  handleCollapseAll() {
    let temp = this.state.periodList;
    let tempIndex = [];
    let tempStyle = [];

    if (this.state.periodCollapseIndex.length === this.state.periodList.length) {
      this.setState({
        periodCollapseIndex: [],
      });
      return;
    }

    // eslint-disable-next-line
    temp.map((period, index) => {
      tempStyle[index] = {
        maxHeight: this.periodRef[index].clientHeight,
        overflow: "hidden",
      };
      tempIndex[index] = index;
    });

    this.setState({
      periodCollapseIndex: tempIndex,
      heightStyle: tempStyle,
    });
  }

  onDragStart = (e, index) => {
    this.setState({ currentDragged: index });
    this.draggedItem = this.state.periodList[index];
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.parentNode);
    e.dataTransfer.setDragImage(e.target.parentNode, 20, 20);
  };

  onDragOver = (e, index) => {
    e.preventDefault();
    const draggedOverItem = this.state.periodList[index];

    this.setState({ currentOver: index });
    // if the item is dragged over itself, ignore
    if (this.draggedItem === draggedOverItem) {
      return;
    }
    // filter out the currently dragged item
    let items = this.state.periodList.filter((item) => item !== this.draggedItem);

    // add the dragged item after the dragged over item
    items.splice(index, 0, this.draggedItem);

    this.setState({ periodList: items });
  };

  onDragEnd = () => {
    this.setState({ currentOver: -1, currentDragged: -1 });
  };

  handleCreateNewWorkout = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (this.state.selectedPeriodIndex === "" && this.state.nestedSelectedPeriodIndex === "") {
      this.setState({
        isError: true,
        missingField: "You need to select a period. Period ",
      });
      return;
    }

    this.setState(
      {
        isError: false,
        isNewWorkoutNameEmpty: false,
        isNewWorkOutDescEmpty: false,
        missingField: "",
      },
      () => {
        if (this.state.newWorkoutName === "") {
          this.setState({
            isNewWorkoutNameEmpty: true,
            isError: true,
            missingField: "Workout Name",
          });
          return;
        }

        if (this.state.newWorkoutDesc === "") {
          this.setState({
            isNewWorkOutDescEmpty: true,
            isError: true,
            missingField: "Workout Description",
          });
          return;
        }

        if (
          this.state.nestedSelectedPeriodIndex !== "" &&
          this.state.nestedSelectedWorkoutIndex !== ""
        ) {
          let newWorkout = {
            name: this.state.newWorkoutName,
            description: this.state.newWorkoutDesc,
            exercises: this.state.periodList[this.state.nestedSelectedPeriodIndex].workouts[
              this.state.nestedSelectedWorkoutIndex
            ].exercises,
          };

          let targetPeriod = this.state.periodList[this.state.nestedSelectedPeriodIndex];

          targetPeriod.workouts[this.state.nestedSelectedWorkoutIndex] = newWorkout;
          let newPeriodList = this.state.periodList;

          newPeriodList[this.state.nestedSelectedPeriodIndex] = targetPeriod;

          this.setState(
            {
              periodList: newPeriodList,
            },
            () => {
              this.setState({
                newWorkoutName: "",
                newWorkoutDesc: "",
                selectedPeriodIndex: this.state.nestedSelectedPeriodIndex,
                nestedSelectedPeriodIndex: "",
                nestedSelectedWorkoutIndex: "",
                selectedWorkoutIndex: "",
              });
            }
          );
        } else {
          let newWorkout = {
            name: this.state.newWorkoutName,
            description: this.state.newWorkoutDesc,
            exercises: [],
          };

          let targetPeriod = this.state.periodList[this.state.selectedPeriodIndex];

          targetPeriod.workouts = [
            ...this.state.periodList[this.state.selectedPeriodIndex].workouts,
            newWorkout,
          ];
          let newPeriodList = this.state.periodList;

          newPeriodList[this.state.selectedPeriodIndex] = targetPeriod;

          this.setState(
            {
              periodList: newPeriodList,
            },
            () => {
              this.setState({
                newWorkoutName: "",
                newWorkoutDesc: "",
              });
            }
          );
        }
      }
    );
  };

  handleCreateNewExercise = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (
      this.state.nestedSelectedPeriodIndex === "" &&
      this.state.nestedSelectedWorkoutIndex === ""
    ) {
      this.setState({
        isError: true,
        missingField: "You need to select a Workout ",
      });
      return;
    }

    this.setState(
      {
        isError: false,
        isEmptySets: false,
        isEmptyReps: false,
        isEmptyOrder: false,
        isEmptyInfo: false,
        isEmptyResistance: false,
        isEmptyRest: false,
        isEmptyNewExerciseName: false,
        isEmptyNewExerciseDesc: false,
        isExerciseNotSelected: false,
        missingField: "",
      },
      () => {
        // if (this.state.isCreatingNewExerciseResource) {
        //     if (this.state.newExerciseName === '') {
        //         this.setState({
        //             isEmptyNewExerciseName: true,
        //             isError: true,
        //             missingField: 'Exercise Name '
        //         })
        //         return
        //     }
        //     if (this.state.newExerciseDesc === '') {
        //         this.setState({
        //             isEmptyNewExerciseDesc: true,
        //             isError: true,
        //             missingField: 'Exercise Description '
        //         })
        //         return
        //     }
        // }

        if (this.state.exerciseSets === "") {
          this.setState({
            isEmptySets: true,
            isError: true,
            missingField: "Sets ",
          });
          return;
        }

        if (this.state.selectedExercise === -1) {
          this.setState({
            isExerciseNotSelected: true,
            isError: true,
            missingField: "Exercise  ",
          });
          return;
        }

        // if (this.state.exerciseReps === '') {
        //     this.setState({
        //         isEmptyReps: true,
        //         isError: true,
        //         missingField: 'Reps '
        //     })
        //     return
        // }
        // if (this.state.exerciseResistance === '') {
        //     this.setState({
        //         isEmptyResistance: true,
        //         isError: true,
        //         missingField: 'Resistance '
        //     })
        //     return
        // }
        let newExercise;
        if (this.state.isCreatingNewExerciseResource) {
          newExercise = {
            name: this.state.newExerciseName,
            description: this.state.newExerciseDesc,
            sets: this.state.exerciseSets,
            reps: this.state.exerciseReps,
            resistance: this.state.exerciseResistance,
            rest: this.state.exerciseRest,
            tag: this.state.exerciseTag,
            info: this.state.exerciseInfo,
          };
        } else {
          newExercise = {
            name: this.state.exerciseList[this.state.selectedExercise].name,
            description: this.state.exerciseList[this.state.selectedExercise].description,
            sets: this.state.exerciseSets,
            reps: this.state.exerciseReps,
            resistance: this.state.exerciseResistance,
            rest: this.state.exerciseRest,
            tag: this.state.exerciseTag,
            info: this.state.exerciseInfo,
          };
        }
        let newPeriodList;
        if (
          this.state.nestedSelectedPeriodIndex !== "" &&
          this.state.nestedSelectedWorkoutIndex !== "" &&
          this.state.nestedSelectedExerciseIndex !== ""
        ) {
          //edit the current one
          let targetedPeriod = this.state.periodList[this.state.nestedSelectedPeriodIndex];
          targetedPeriod.workouts[this.state.nestedSelectedWorkoutIndex].exercises[
            this.state.nestedSelectedExerciseIndex
          ] = newExercise;

          newPeriodList = this.state.periodList;

          newPeriodList[this.state.nestedSelectedPeriodIndex] = targetedPeriod;
        } else {
          let targetedPeriod = this.state.periodList[this.state.nestedSelectedPeriodIndex];
          targetedPeriod.workouts[this.state.nestedSelectedWorkoutIndex].exercises = [
            ...targetedPeriod.workouts[this.state.nestedSelectedWorkoutIndex].exercises,
            newExercise,
          ];

          newPeriodList = this.state.periodList;

          newPeriodList[this.state.nestedSelectedPeriodIndex] = targetedPeriod;
        }

        //create a new exe

        // let targetedPeriod = this.state.periodList[this.state.nestedSelectedPeriodIndex]
        // targetedPeriod.workouts[this.state.nestedSelectedWorkoutIndex].exercises = [
        //     ...targetedPeriod.workouts[this.state.nestedSelectedWorkoutIndex].exercises,
        //     newExercise
        // ]
        //
        // let newPeriodList = this.state.periodList
        //
        // newPeriodList[this.state.nestedSelectedPeriodIndex] = targetedPeriod

        this.setState(
          {
            periodList: newPeriodList,
          },
          () => {
            this.setState({
              selectedExercise: -1,
              exerciseSets: "",
              exerciseReps: "",
              exerciseTag: "",
              exerciseInfo: "",
              exerciseResistance: "",
              exerciseRest: "",
              newExerciseName: "",
              newExerciseDesc: "",
              newExerciseVideoLink: "",
              addExeInfo: "",
              // nestedSelectedPeriodIndex: '',
              // nestedSelectedWorkoutIndex: '',
              nestedSelectedExerciseIndex: "",
            });
          }
        );
      }
    );
  };

  handleInput = (e, type) => {
    switch (type) {
      case "period_name":
        this.setState({
          newPeriodName: e.target.value,
        });
        break;
      case "period_desc":
        this.setState({
          newPeriodDesc: e.target.value,
        });
        break;
      case "period_start":
        break;
      case "period_end":
        break;
      case "workout_name":
        this.setState({
          newWorkoutName: e.target.value,
        });
        break;
      case "workout_desc":
        this.setState({
          newWorkoutDesc: e.target.value,
        });
        break;
      case "exercise_sets":
        this.setState({
          exerciseSets: e.target.value,
        });
        break;
      case "exercise_reps":
        this.setState({
          exerciseReps: e.target.value,
        });
        break;
      case "exercise_resistance":
        this.setState({
          exerciseResistance: e.target.value,
        });
        break;
      case "exercise_rest":
        this.setState({
          exerciseRest: e.target.value,
        });
        break;
      case "exercise_tag":
        this.setState({
          exerciseTag: e.target.value,
        });
        break;
      case "exercise_info":
        this.setState({
          exerciseInfo: e.target.value,
        });
        break;
      case "exercise_name":
        this.setState({
          newExerciseName: e.target.value,
        });
        break;
      case "exercise_desc":
        this.setState({
          newExerciseDesc: e.target.value,
        });
        break;
      case "exercise_video_link":
        this.setState({
          newExerciseVideoLink: e.target.value,
        });
        break;
      default:
        break;
    }
  };

  handleUpdate = (e, type, periodIndex, workoutIndex, exerciseIndex) => {
    if (type === "period_name") {
      let targetPeriod = this.state.periodList[periodIndex];
      let updatedPeriod = {
        id: targetPeriod.id,
        name: e.target.value,
        info: targetPeriod.info,
        start_time: targetPeriod.start_time,
        end_time: 0,
        workouts: targetPeriod.workouts,
      };
      let newPeriodList = this.state.periodList;
      newPeriodList[periodIndex] = updatedPeriod;

      this.setState({
        periodList: newPeriodList,
      });
      return;
    }

    if (type === "period_desc") {
      let targetPeriod = this.state.periodList[periodIndex];
      let updatedPeriod = {
        id: targetPeriod.id,
        name: targetPeriod.name,
        info: e.target.value,
        start_time: targetPeriod.start_time,
        end: 0,
        workouts: targetPeriod.workouts,
      };
      let newPeriodList = this.state.periodList;
      newPeriodList[periodIndex] = updatedPeriod;

      this.setState({
        periodList: newPeriodList,
      });

      return;
    }

    if (type === "workout_name") {
      let targetPeriod = this.state.periodList[periodIndex];
      let targetWorkout = targetPeriod.workouts[workoutIndex];

      targetPeriod.workouts[workoutIndex] = {
        name: e.target.value,
        info: targetWorkout.info,
        exercises: targetWorkout.exercises,
        created_at: targetWorkout.created_at,
        creator_id: targetWorkout.creator_id,
        id: targetWorkout.id,
        locale: targetWorkout.locale,
        removed: targetWorkout.removed,
        period_workout_id: targetWorkout.period_workout_id,
        workout_number: targetWorkout.workout_number,
      };
      let newPeriodList = this.state.periodList;

      newPeriodList[periodIndex] = targetPeriod;

      this.setState({
        periodList: newPeriodList,
      });
      return;
    }

    if (type === "workout_desc") {
      let targetPeriod = this.state.periodList[periodIndex];
      let targetWorkout = targetPeriod.workouts[workoutIndex];

      targetPeriod.workouts[workoutIndex] = {
        name: targetWorkout.name,
        info: e.target.value,
        exercises: targetWorkout.exercises,
        created_at: targetWorkout.created_at,
        creator_id: targetWorkout.creator_id,
        id: targetWorkout.id,
        locale: targetWorkout.locale,
        removed: targetWorkout.removed,
        period_workout_id: targetWorkout.period_workout_id,
        workout_number: targetWorkout.workout_number,
      };

      let newPeriodList = this.state.periodList;

      newPeriodList[periodIndex] = targetPeriod;

      this.setState({
        periodList: newPeriodList,
      });
      return;
    }

    if (type === "exercise_sets") {
      let targetPeriod = this.state.periodList[periodIndex];
      let targetWorkout = targetPeriod.workouts[workoutIndex];
      let targetExercise = targetWorkout.exercises[exerciseIndex];

      targetWorkout.exercises[exerciseIndex] = {
        created_at: targetExercise.created_at,
        creator_id: targetExercise.creator_id,
        exercise_id: targetExercise.exercise_id,
        id: targetExercise.id,
        info: targetExercise.info,
        order: targetExercise.order,
        removed: targetExercise.removed,
        reps: targetExercise.reps,
        resistance: targetExercise.resistance,
        rest: targetExercise.rest,
        sets: e.target.value,
        tag: targetExercise.tag,
        workout_id: targetExercise.workout_id,
      };

      let newPeriodList = this.state.periodList;

      newPeriodList[periodIndex] = targetPeriod;

      this.setState({
        periodList: newPeriodList,
      });
      return;
    }

    if (type === "exercise_reps") {
      let targetPeriod = this.state.periodList[periodIndex];
      let targetWorkout = targetPeriod.workouts[workoutIndex];
      let targetExercise = targetWorkout.exercises[exerciseIndex];

      targetWorkout.exercises[exerciseIndex] = {
        created_at: targetExercise.created_at,
        creator_id: targetExercise.creator_id,
        exercise_id: targetExercise.exercise_id,
        id: targetExercise.id,
        info: targetExercise.info,
        order: targetExercise.order,
        removed: targetExercise.removed,
        reps: e.target.value,
        resistance: targetExercise.resistance,
        rest: targetExercise.rest,
        sets: targetExercise.sets,
        tag: targetExercise.tag,
        workout_id: targetExercise.workout_id,
      };

      let newPeriodList = this.state.periodList;

      newPeriodList[periodIndex] = targetPeriod;

      this.setState({
        periodList: newPeriodList,
      });
      return;
    }

    if (type === "exercise_rest") {
      let targetPeriod = this.state.periodList[periodIndex];
      let targetWorkout = targetPeriod.workouts[workoutIndex];
      let targetExercise = targetWorkout.exercises[exerciseIndex];

      targetWorkout.exercises[exerciseIndex] = {
        created_at: targetExercise.created_at,
        creator_id: targetExercise.creator_id,
        exercise_id: targetExercise.exercise_id,
        id: targetExercise.id,
        info: targetExercise.info,
        order: targetExercise.order,
        removed: targetExercise.removed,
        reps: targetExercise.reps,
        resistance: targetExercise.resistance,
        rest: e.target.value,
        sets: targetExercise.sets,
        tag: targetExercise.tag,
        workout_id: targetExercise.workout_id,
      };

      let newPeriodList = this.state.periodList;

      newPeriodList[periodIndex] = targetPeriod;

      this.setState({
        periodList: newPeriodList,
      });
    }

    if (type === "exercise_info") {
      if (this.state.exeInfoExerciseIndex === -1) {
        this.setState({
          addExeInfo: e.target.value,
        });
        return;
      }

      let targetPeriod = this.state.periodList[this.state.exeInfoPeriodIndex];
      let targetWorkout = targetPeriod.workouts[this.state.exeInfoWorkoutIndex];
      let targetExercise = targetWorkout.exercises[this.state.exeInfoExerciseIndex];

      targetWorkout.exercises[this.state.exeInfoExerciseIndex] = {
        created_at: targetExercise.created_at,
        creator_id: targetExercise.creator_id,
        exercise_id: targetExercise.exercise_id,
        id: targetExercise.id,
        info: e.target.value,
        order: targetExercise.order,
        removed: targetExercise.removed,
        reps: targetExercise.reps,
        resistance: targetExercise.resistance,
        rest: targetExercise.rest,
        sets: targetExercise.sets,
        tag: targetExercise.tag,
        workout_id: targetExercise.workout_id,
      };

      let newPeriodList = this.state.periodList;

      newPeriodList[this.state.exeInfoPeriodIndex] = targetPeriod;

      this.setState({
        periodList: newPeriodList,
        addExeInfo: e.target.value,
      });
    }
  };

  handleExerciseSelect = (item) => {
    console.log("called in handleExerciseSelect", item);
    if (this.state.shouldUpdateExeOnServer) {
      let periodIndex = this.state.exePeriodIndex;
      let workoutIndex = this.state.exeWorkoutIndex;
      let exerciseIndex = this.state.exeExerciseIndex;

      // getting the data of the exe
      let targetPeriod = this.state.periodList[periodIndex];
      let targetWorkout = targetPeriod.workouts[workoutIndex];
      let targetExercise = targetWorkout.exercises[exerciseIndex];

      targetWorkout.exercises[exerciseIndex] = {
        created_at: targetExercise.created_at,
        creator_id: targetExercise.creator_id,
        exercise_id: item.id,
        id: targetExercise.id,
        info: targetExercise.info,
        order: targetExercise.order,
        removed: targetExercise.removed,
        reps: targetExercise.reps,
        resistance: targetExercise.resistance,
        rest: targetExercise.rest,
        sets: targetExercise.sets,
        tag: targetExercise.tag,
        workout_id: targetExercise.workout_id,
      };

      let newPeriodList = this.state.periodList;

      newPeriodList[periodIndex] = targetPeriod;

      this.setState(
        {
          periodList: newPeriodList,
          shouldUpdateExeOnServer: false,
        },
        () => {
          let updatedExe = this.state.periodList[periodIndex].workouts[workoutIndex].exercises[
            exerciseIndex
          ];
          let payload = {
            id: updatedExe.id,
            exercise_id: item.id,
            workout_id: this.state.periodList[periodIndex].workouts[workoutIndex].id,
            sets: parseInt(updatedExe.sets),
            reps: updatedExe.reps,
            rest: updatedExe.rest,
            info: updatedExe.info,
            order: updatedExe.order,
          };
          this.props.updateExercise(this.props.token, payload).then(() => {
            if (this.props.coachExercisePlanState.isExerciseUpdated) {
              console.log("exercise is updated (dropdown)");
            } else {
              console.log(
                "exercise update failed with (dropdown): ",
                this.props.coachExercisePlanState.exerciseUpdateError
              );
            }
          });
        }
      );
    } else {
      console.log("here is the item", item.id);
      this.setState({
        selectedExercise: item.id,
        exerciseInfoObject: item,
      });
    }
  };

  handleExerciseSelectUpdate = (periodIndex, workoutIndex, exerciseIndex) => {
    console.log("called in handleExerciseSelectUpdate", periodIndex, workoutIndex, exerciseIndex);
    this.setState({
      shouldUpdateExeOnServer: true,
      exePeriodIndex: periodIndex,
      exeWorkoutIndex: workoutIndex,
      exeExerciseIndex: exerciseIndex,
      newExeIDSelected: -10,
    });
  };

  handleExerciseInfoClick = (exe) => {
    console.log("object", exe);
    this.setState({
      showExerciseInfoPopup: true,
      exerciseInfoObject: exe,
    });
  };

  handleOrderChange = (e, direction, type, periodIndex, workoutIndex, exerciseIndex) => {
    e.preventDefault();
    e.stopPropagation();

    if (type === "exercise") {
      let payload, payloadOther, tmp, tmpOther, updatedPeriodList;
      if (this.state.periodList[periodIndex].workouts[workoutIndex].exercises.length === 1) {
        //one item only no need to do any re ordering
        return;
      }

      if (direction === "increase") {
        tmp = this.state.periodList[periodIndex].workouts[workoutIndex].exercises[exerciseIndex];
        tmpOther = this.state.periodList[periodIndex].workouts[workoutIndex].exercises[
          exerciseIndex + 1
        ];

        payload = {
          id: tmp.id,
          order: tmp.order + 1,
        };

        payloadOther = {
          id: tmpOther.id,
          order: tmpOther.order - 1,
        };
      }

      if (direction === "decrease") {
        tmp = this.state.periodList[periodIndex].workouts[workoutIndex].exercises[exerciseIndex];
        tmpOther = this.state.periodList[periodIndex].workouts[workoutIndex].exercises[
          exerciseIndex - 1
        ];

        payload = {
          id: tmp.id,
          order: tmp.order - 1,
        };

        payloadOther = {
          id: tmpOther.id,
          order: tmpOther.order + 1,
        };
      }

      this.props.updateExercise(this.props.token, payload).then(() => {
        if (this.props.coachExercisePlanState.isExerciseUpdated) {
          this.props.updateExercise(this.props.token, payloadOther).then(() => {
            if (this.props.coachExercisePlanState.isExerciseUpdated) {
              //All updates in the backend done, update the UI
              if (direction === "increase") {
                tmp.order = tmp.order + 1;
                tmpOther.order = tmpOther.order - 1;
                updatedPeriodList = this.state.periodList;
                updatedPeriodList[periodIndex].workouts[workoutIndex].exercises[
                  exerciseIndex
                ] = tmpOther;
                updatedPeriodList[periodIndex].workouts[workoutIndex].exercises[
                  exerciseIndex + 1
                ] = tmp;
              }
              if (direction === "decrease") {
                tmp.order = tmp.order - 1;
                tmpOther.order = tmpOther.order + 1;
                updatedPeriodList = this.state.periodList;
                updatedPeriodList[periodIndex].workouts[workoutIndex].exercises[
                  exerciseIndex
                ] = tmpOther;
                updatedPeriodList[periodIndex].workouts[workoutIndex].exercises[
                  exerciseIndex - 1
                ] = tmp;
              }

              this.setState({
                periodList: updatedPeriodList,
              });
            } else {
              console.log(
                "exercise update failed with: ",
                this.props.coachExercisePlanState.exerciseUpdateError
              );
            }
          });
        } else {
          console.log(
            "exercise update failed with: ",
            this.props.coachExercisePlanState.exerciseUpdateError
          );
        }
      });
    }

    if (type === "workout") {
      //updateWorkoutOrder
      let payload, payloadOther, tmp, tmpOther, updatedPeriodList;
      if (this.state.periodList[periodIndex].workouts.length === 1) {
        //one item only no need to do any re ordering
        return;
      }

      if (direction === "increase") {
        tmp = this.state.periodList[periodIndex].workouts[workoutIndex];
        tmpOther = this.state.periodList[periodIndex].workouts[workoutIndex + 1];

        payload = {
          id: tmp.period_workout_id,
          workout_number: tmp.workout_number + 1,
        };

        payloadOther = {
          id: tmpOther.period_workout_id,
          workout_number: tmpOther.workout_number - 1,
        };
      }

      if (direction === "decrease") {
        tmp = this.state.periodList[periodIndex].workouts[workoutIndex];
        tmpOther = this.state.periodList[periodIndex].workouts[workoutIndex - 1];

        payload = {
          id: tmp.period_workout_id,
          workout_number: tmp.workout_number - 1,
        };

        payloadOther = {
          id: tmpOther.period_workout_id,
          workout_number: tmpOther.workout_number + 1,
        };
      }

      console.log(direction, payload, payloadOther);

      this.props.updateWorkoutOrder(this.props.token, payload).then(() => {
        if (this.props.coachExercisePlanState.isExerciseWorkoutOrderUpdated) {
          this.props.updateWorkoutOrder(this.props.token, payloadOther).then(() => {
            if (this.props.coachExercisePlanState.isExerciseWorkoutOrderUpdated) {
              if (direction === "increase") {
                tmp.workout_number = tmp.workout_number + 1;
                tmpOther.workout_number = tmpOther.workout_number - 1;
                updatedPeriodList = this.state.periodList;
                updatedPeriodList[periodIndex].workouts[workoutIndex] = tmpOther;
                updatedPeriodList[periodIndex].workouts[workoutIndex + 1] = tmp;
              }
              if (direction === "decrease") {
                tmp.workout_number = tmp.workout_number - 1;
                tmpOther.workout_number = tmpOther.workout_number + 1;
                updatedPeriodList = this.state.periodList;
                updatedPeriodList[periodIndex].workouts[workoutIndex] = tmpOther;
                updatedPeriodList[periodIndex].workouts[workoutIndex - 1] = tmp;
              }

              this.setState({
                periodList: updatedPeriodList,
              });
            } else {
              console.log(
                "exercise update 1 failed with: ",
                this.props.coachExercisePlanState.exerciseWorkoutUpdateError
              );
            }
          });
        } else {
          console.log(
            "exercise update failed with: ",
            this.props.coachExercisePlanState.exerciseWorkoutUpdateError
          );
        }
      });
    }

    if (type === "period") {
      //updateWorkoutOrder
      let payload, payloadOther, tmp, tmpOther, updatedPeriodList;
      if (this.state.periodList.length === 1) {
        //one item only no need to do any re ordering
        return;
      }

      if (direction === "increase") {
        tmp = this.state.periodList[periodIndex];
        tmpOther = this.state.periodList[periodIndex + 1];

        // console.log(tmp)

        payload = {
          period_id: tmp.id,
          start_time: tmp.start_time + 1,
        };

        payloadOther = {
          period_id: tmpOther.id,
          start_time: tmpOther.start_time - 1,
        };
      }

      if (direction === "decrease") {
        tmp = this.state.periodList[periodIndex];
        tmpOther = this.state.periodList[periodIndex - 1];

        payload = {
          period_id: tmp.id,
          start_time: tmp.start_time - 1,
        };

        payloadOther = {
          period_id: tmpOther.id,
          start_time: tmpOther.start_time + 1,
        };
      }

      this.props.updatePeriod(this.props.token, payload).then(() => {
        if (this.props.coachExercisePlanState.isExercisePeriodUpdated) {
          this.props.updatePeriod(this.props.token, payloadOther).then(() => {
            if (this.props.coachExercisePlanState.isExercisePeriodUpdated) {
              if (direction === "increase") {
                tmp.start_time = tmp.start_time + 1;
                tmpOther.start_time = tmpOther.start_time - 1;
                updatedPeriodList = this.state.periodList;
                updatedPeriodList[periodIndex] = tmpOther;
                updatedPeriodList[periodIndex + 1] = tmp;
              }
              if (direction === "decrease") {
                tmp.start_time = tmp.start_time - 1;
                tmpOther.start_time = tmpOther.start_time + 1;
                updatedPeriodList = this.state.periodList;
                updatedPeriodList[periodIndex] = tmpOther;
                updatedPeriodList[periodIndex - 1] = tmp;
              }

              this.setState({
                periodList: updatedPeriodList,
              });
            } else {
              console.log(
                "period update failed with: ",
                this.props.coachExercisePlanState.exercisePeriodUpdateError
              );
            }
          });
        } else {
          console.log(
            "period update failed with: ",
            this.props.coachExercisePlanState.exercisePeriodUpdateError
          );
        }
      });

      // this.props.updateWorkoutOrder(this.props.token, payload).then(() => {
      //     if (this.props.coachExercisePlanState.isExerciseWorkoutOrderUpdated) {
      //         this.props.updateWorkoutOrder(this.props.token, payloadOther).then(() => {
      //             if (this.props.coachExercisePlanState.isExerciseWorkoutOrderUpdated) {
      //                 if (direction === 'increase') {
      //                     tmp.workout_number = tmp.workout_number + 1
      //                     tmpOther.workout_number = tmpOther.workout_number - 1
      //                     updatedPeriodList = this.state.periodList
      //                     updatedPeriodList[periodIndex].workouts[workoutIndex] = tmpOther
      //                     updatedPeriodList[periodIndex].workouts[workoutIndex + 1] = tmp
      //                 }
      //                 if (direction === 'decrease') {
      //                     tmp.workout_number = tmp.workout_number - 1
      //                     tmpOther.workout_number = tmpOther.workout_number + 1
      //                     updatedPeriodList = this.state.periodList
      //                     updatedPeriodList[periodIndex].workouts[workoutIndex] = tmpOther
      //                     updatedPeriodList[periodIndex].workouts[workoutIndex - 1] = tmp
      //                 }
      //
      //                 this.setState({
      //                     periodList: updatedPeriodList
      //                 })
      //             } else {
      //                 console.log(
      //                     'exercise update 1 failed with: ',
      //                     this.props.coachExercisePlanState.exerciseWorkoutUpdateError
      //                 )
      //             }
      //         })
      //     } else {
      //         console.log(
      //             'exercise update failed with: ',
      //             this.props.coachExercisePlanState.exerciseWorkoutUpdateError
      //         )
      //     }
      // })
    }
  };

  getVideoID = (url) => {
    if (url == null || url.trim().length < 10) return "Ei44TInmu5s";
    let video_id = url.split("v=")[1];
    let ampersandPosition = video_id.indexOf("&");
    if (ampersandPosition !== -1) {
      video_id = video_id.substring(0, ampersandPosition);
    }
    console.log(video_id);
    return video_id;
  };

  handleVideoReady = () => {
    // e.target.pauseVideo()
  };

  render() {
    const { t } = this.props;
    return (
      <div className={style.main_container}>
        <div>
          <ExerciseForm
            periodIndex={this.state.periodIndex}
            workoutIndex={this.state.workoutIndex}
            newExeIDSelected={this.state.newExeIDSelected}
            exerciseList={this.state.exerciseList}
            isEmptySets={this.state.isEmptySets}
            exerciseSets={this.state.exerciseSets}
            exerciseReps={this.state.exerciseReps}
            exerciseRest={this.state.exerciseRest}
            isEmptyResistance={this.state.isEmptyResistance}
            handleSubmit={this.handleCreateNewExercise}
            handleExerciseSelect={this.handleExerciseSelect}
            handleExerciseInfoClick={this.handleExerciseInfoClick}
            handleInput={this.handleInput}
            handleAddInfoClick={this.handleAddInfoClick}
          />
        </div>
        <div className={style.exe_planner_container}>
          {this.state.periodList.map((period, periodIndex) => (
            <div
              className={style.periods_list}
              key={period.id}
              // onDragOver={e => this.onDragOver(e, periodIndex)}
              style={Object.assign(
                {},
                // this.state.currentOver === periodIndex ? {background: '#ff8700'} : {},
                this.state.periodCollapseIndex.includes(periodIndex)
                  ? this.state.heightStyle[periodIndex]
                  : {}
              )}
            >
              <div
                className={`${style.workout_header} ${
                  this.state.selectedPeriodIndex === periodIndex ? "" : ""
                }`}
                // draggable
                // onDragStart={e => this.onDragStart(e, periodIndex)}
                // onDragEnd={this.onDragEnd}
                ref={(periodName) => (this.periodRef[periodIndex] = periodName)}
              >
                <div
                  className={style.collapse_icon_wrapper_workout}
                  onClick={() => this.handlePeriodCollapse(periodIndex)}
                >
                  <FontAwesomeIcon
                    icon={
                      this.state.periodCollapseIndex.includes(periodIndex)
                        ? faAngleRight
                        : faAngleDown
                    }
                    size="2x"
                  />
                  <h1 className={style.workout_number}>
                    {t("ExercisePlan.period")} {periodIndex + 1}
                  </h1>

                  {period.id !== -1 && (
                    // <h1
                    //     className={style.workout_number}
                    //     onClick={e => this.handlePeriodDuplicate(e, periodIndex)}>
                    //     {t('ExercisePlan.duplicate')}
                    // </h1>
                    <FontAwesomeIcon
                      icon={faCopy}
                      className={style.duplicate}
                      onClick={(e) => this.handlePeriodDuplicate(e, periodIndex)}
                    />
                  )}
                  {period.id !== -1 && (
                    // <h1
                    //     className={style.workout_number}
                    //     onClick={e => this.handleDeletePeriod(e, periodIndex)}>
                    //     {t('ExercisePlan.delete')}
                    // </h1>

                    <FontAwesomeIcon
                      icon={faTrashAlt}
                      className={style.delete}
                      onClick={(e) => this.handleDeletePeriod(e, periodIndex)}
                    />
                  )}

                  {period.id !== -1 && this.state.periodList.length > 1 && periodIndex !== 0 && (
                    <FontAwesomeIcon
                      icon={faArrowAltCircleUp}
                      className={style.reorder_arrow}
                      onClick={(e) =>
                        this.handleOrderChange(e, "decrease", "period", periodIndex, -1, -1)
                      }
                    />
                  )}

                  {period.id !== -1 &&
                    this.state.periodList.length > 1 &&
                    periodIndex !== this.state.periodList.length - 1 && (
                      <FontAwesomeIcon
                        icon={faArrowAltCircleDown}
                        className={style.reorder_arrow}
                        onClick={(e) =>
                          this.handleOrderChange(e, "increase", "period", periodIndex, -1, -1)
                        }
                      />
                    )}
                </div>
                <form
                  // onSubmit={() => this.handlePeriod(periodIndex, false)}
                  className={style.form_workout}
                >
                  <InputControl
                    label={
                      period.id !== -1
                        ? period.name.length < 1
                          ? t("ExercisePlan.period-name-required")
                          : t("ExercisePlan.period-name")
                        : this.state.isNewPeriodNameEmpty
                        ? t("ExercisePlan.period-name-required")
                        : this.state.isError && this.state.errorLocation === periodIndex
                        ? t("ExercisePlan.period-name-required")
                        : t("ExercisePlan.period-name")
                    }
                    isEmpty={period.name.length < 1}
                    isError={
                      period.id === -1
                        ? this.state.isNewPeriodNameEmpty
                        : this.state.isError && this.state.errorLocation === periodIndex
                    }
                    className={style.input_control_workout_name}
                  >
                    <input
                      className={style.new_workout_name}
                      type="text"
                      value={period.name}
                      onChange={(evt) =>
                        this.handleUpdate(
                          evt,
                          "period_name",
                          periodIndex,
                          -1,
                          -1,
                          "name list on change"
                        )
                      }
                      onBlur={() => this.handlePeriod(periodIndex, false)}
                    />
                  </InputControl>
                  <span className={style.workout_filler} />
                  <InputControl
                    label={t("ExercisePlan.period-desc")}
                    isEmpty={period.info.length < 1 || period.info === "not provided - 43S24Uvaui"}
                    isError={false}
                    className={style.input_control_workout_desc}
                  >
                    <input
                      className={style.new_workout_description}
                      value={period.info === "not provided - 43S24Uvaui" ? "" : period.info}
                      onChange={(evt) =>
                        this.handleUpdate(
                          evt,
                          "period_desc",
                          periodIndex,
                          -1,
                          -1,
                          "period list on change"
                        )
                      }
                      onBlur={() => this.handlePeriod(periodIndex, false)}
                    />
                  </InputControl>
                </form>
              </div>
              {/**/}
              {/**/}
              {/* LIST OF WORKOUTS */}
              {/**/}
              {/**/}
              {period.workouts.map((workout, workoutIndex) => (
                <div
                  className={style.workout_list}
                  key={workout.id}
                  style={
                    this.state.workoutCollapseIndex.includes(periodIndex + "-" + workoutIndex)
                      ? this.state.workoutHeightStyle
                      : {}
                  }
                >
                  <div className={style.workout_header} ref={this.workoutHeaderRef}>
                    <div
                      className={style.collapse_icon_wrapper_workout}
                      onClick={() => this.handleWorkoutCollapse(periodIndex, workoutIndex)}
                    >
                      <FontAwesomeIcon
                        icon={
                          this.state.workoutCollapseIndex.includes(periodIndex + "-" + workoutIndex)
                            ? faAngleRight
                            : faAngleDown
                        }
                        size="2x"
                      />
                      <h1 className={style.workout_number}>
                        {t("ExercisePlan.workout")} {workoutIndex + 1}
                      </h1>
                      {workout.id !== -1 && (
                        // <h1
                        //     className={style.workout_number}
                        //     onClick={e =>
                        //         this.handleWorkoutDuplicate(e, periodIndex, workoutIndex)
                        //     }>
                        //     {t('ExercisePlan.duplicate')}
                        // </h1>
                        <FontAwesomeIcon
                          icon={faCopy}
                          className={style.duplicate}
                          onClick={(e) => this.handleWorkoutDuplicate(e, periodIndex, workoutIndex)}
                        />
                      )}
                      {workout.id !== -1 && (
                        // <h1
                        //     className={style.workout_number}
                        //     onClick={e =>
                        //         this.handleDeleteWorkout(e, periodIndex, workoutIndex)
                        //     }>
                        //     {t('ExercisePlan.delete')}
                        // </h1>
                        <FontAwesomeIcon
                          icon={faTrashAlt}
                          className={style.delete}
                          onClick={(e) => this.handleDeleteWorkout(e, periodIndex, workoutIndex)}
                        />
                      )}

                      {workout.id !== -1 && period.workouts.length > 1 && workoutIndex !== 0 && (
                        <FontAwesomeIcon
                          icon={faArrowAltCircleUp}
                          className={style.reorder_arrow}
                          onClick={(e) =>
                            this.handleOrderChange(
                              e,
                              "decrease",
                              "workout",
                              periodIndex,
                              workoutIndex,
                              -1
                            )
                          }
                        />
                      )}

                      {workout.id !== -1 &&
                        period.workouts.length > 1 &&
                        workoutIndex !== period.workouts.length - 1 && (
                          <FontAwesomeIcon
                            icon={faArrowAltCircleDown}
                            className={style.reorder_arrow}
                            onClick={(e) =>
                              this.handleOrderChange(
                                e,
                                "increase",
                                "workout",
                                periodIndex,
                                workoutIndex,
                                -1
                              )
                            }
                          />
                        )}
                    </div>

                    <form
                      onSubmit={(event) => this.handleCreateNewWorkout(event)}
                      className={style.form_workout}
                    >
                      <InputControl
                        label={
                          workout.name.length < 1
                            ? t("ExercisePlan.workout-name-required")
                            : t("ExercisePlan.workout-name")
                        }
                        isEmpty={workout.name.length < 1}
                        isError={workout.name.length < 1}
                        className={style.input_control_workout_name}
                      >
                        <input
                          className={style.new_workout_name}
                          type="text"
                          value={workout.name}
                          onChange={(evt) =>
                            this.handleUpdate(evt, "workout_name", periodIndex, workoutIndex, -1)
                          }
                          onBlur={(e) =>
                            this.handleAddWorkoutToPeriod(
                              e,
                              periodIndex,
                              workoutIndex,
                              true,
                              false,
                              true,
                              "update - name"
                            )
                          }
                        />
                      </InputControl>
                      <span className={style.workout_filler} />
                      <InputControl
                        label={t("ExercisePlan.workout-desc")}
                        isEmpty={
                          workout.info.length < 1 || workout.info === "not provided - 43S24Uvaui"
                        }
                        isError={false}
                        className={style.input_control_workout_desc}
                      >
                        <input
                          className={style.new_workout_description}
                          value={workout.info === "not provided - 43S24Uvaui" ? "" : workout.info}
                          onChange={(evt) =>
                            this.handleUpdate(evt, "workout_desc", periodIndex, workoutIndex, -1)
                          }
                          onBlur={(e) =>
                            this.handleAddWorkoutToPeriod(
                              e,
                              periodIndex,
                              workoutIndex,
                              true,
                              false,
                              true,
                              "update - desc"
                            )
                          }
                        />
                      </InputControl>
                    </form>
                  </div>

                  {/**/}
                  {/**/}
                  {/* LIST OF Exercises */}
                  {/**/}
                  {/**/}
                  {workout.exercises.map((exe, exerciseIndex) => (
                    <div className={style.exe_list_item} key={exe.id}>
                      <div className={style.collapse_icon_wrapper_workout}>
                        <h1 className={style.exe_number}>
                          {t("ExercisePlan.exercise")} {exerciseIndex + 1}
                        </h1>
                        {exe.id !== -1 && (
                          // <h1
                          //     className={style.workout_number}
                          //     onClick={e =>
                          //         this.handleExerciseDuplicate(
                          //             e,
                          //             periodIndex,
                          //             workoutIndex,
                          //             exerciseIndex
                          //         )
                          //     }>
                          //     {t('ExercisePlan.duplicate')}
                          // </h1>

                          <FontAwesomeIcon
                            icon={faCopy}
                            className={style.duplicate}
                            onClick={(e) =>
                              this.handleExerciseDuplicate(
                                e,
                                periodIndex,
                                workoutIndex,
                                exerciseIndex
                              )
                            }
                          />
                        )}
                        {exe.id !== -1 && (
                          // <h1
                          //     className={style.workout_number}
                          //     onClick={e =>
                          //         this.handleDeleteExercise(
                          //             e,
                          //             periodIndex,
                          //             workoutIndex,
                          //             exerciseIndex
                          //         )
                          //     }>
                          //     {t('ExercisePlan.delete')}
                          // </h1>
                          <FontAwesomeIcon
                            icon={faTrashAlt}
                            className={style.delete}
                            onClick={(e) =>
                              this.handleDeleteExercise(e, periodIndex, workoutIndex, exerciseIndex)
                            }
                          />
                        )}

                        {exe.id !== -1 && workout.exercises.length > 1 && exerciseIndex !== 0 && (
                          <FontAwesomeIcon
                            icon={faArrowAltCircleUp}
                            className={style.reorder_arrow}
                            onClick={(e) =>
                              this.handleOrderChange(
                                e,
                                "decrease",
                                "exercise",
                                periodIndex,
                                workoutIndex,
                                exerciseIndex
                              )
                            }
                          />
                        )}

                        {exe.id !== -1 &&
                          workout.exercises.length > 1 &&
                          exerciseIndex !== workout.exercises.length - 1 && (
                            <FontAwesomeIcon
                              icon={faArrowAltCircleDown}
                              className={style.reorder_arrow}
                              onClick={(e) =>
                                this.handleOrderChange(
                                  e,
                                  "increase",
                                  "exercise",
                                  periodIndex,
                                  workoutIndex,
                                  exerciseIndex
                                )
                              }
                            />
                          )}
                      </div>

                      <form
                        onSubmit={(event) => this.handleCreateNewExercise(event)}
                        className={`${style.form_exercise} ${style.exercise_list}`}
                      >
                        <div
                          className={style.exe_list_wrapper}
                          onClick={() =>
                            this.handleExerciseSelectUpdate(
                              periodIndex,
                              workoutIndex,
                              exerciseIndex
                            )
                          }
                        >
                          {/*<span className={style.clicker} />*/}
                          <InputControl
                            label={t("ExercisePlan.exercise")}
                            isEmpty={false}
                            isError={false}
                            className={style.input_control_exe_dropdown}
                          >
                            <Dropdown
                              selected={exe.exercise_id}
                              headerBgColor={"white"}
                              width={"100%"}
                              paddingVertical={"0.2rem"}
                              paddingHorizontal={"1rem"}
                              maxHeight={"30rem"}
                              searchable
                              showInfo
                              itemData={this.state.exerciseList}
                              childStyleClassName={style.exercise}
                              itemClick={this.handleExerciseSelect}
                              onInfoClick={this.handleExerciseInfoClick}
                            >
                              {this.state.exerciseList.map((exe) => (
                                <div key={exe.id} className={style.exercise}>
                                  {exe.name}
                                </div>
                              ))}
                            </Dropdown>
                          </InputControl>
                        </div>
                        <span className={style.new_period_time_filler} />
                        <InputControl
                          label={
                            exe.sets.length < 1
                              ? t("ExercisePlan.sets-required")
                              : t("ExercisePlan.sets")
                          }
                          isEmpty={exe.sets.length < 1}
                          isError={exe.sets.length < 1}
                          className={style.input_control_exe}
                        >
                          <input
                            className={style.exe_sets_reps_resist_input}
                            type="number"
                            value={exe.sets}
                            onChange={(evt) =>
                              this.handleUpdate(
                                evt,
                                "exercise_sets",
                                periodIndex,
                                workoutIndex,
                                exerciseIndex,
                                "exercise form the list  on change"
                              )
                            }
                            onBlur={(e) =>
                              this.handleAddExerciseToWorkout(
                                e,
                                workoutIndex,
                                periodIndex,
                                exerciseIndex,
                                false,
                                true
                              )
                            }
                          />
                        </InputControl>
                        <span className={style.new_period_time_filler} />
                        <InputControl
                          label={t("ExercisePlan.reps")}
                          isEmpty={exe.reps.length < 1 || exe.reps === "not provided - 43S24Uvaui"}
                          isError={false}
                          className={style.input_control_exe}
                        >
                          <input
                            className={style.exe_sets_reps_resist_input}
                            type="text"
                            value={exe.reps === "not provided - 43S24Uvaui" ? "" : exe.reps}
                            onChange={(evt) =>
                              this.handleUpdate(
                                evt,
                                "exercise_reps",
                                periodIndex,
                                workoutIndex,
                                exerciseIndex,
                                "exercise form the list  on change"
                              )
                            }
                            onBlur={(e) =>
                              this.handleAddExerciseToWorkout(
                                e,
                                workoutIndex,
                                periodIndex,
                                exerciseIndex,
                                false,
                                true
                              )
                            }
                          />
                        </InputControl>
                        <span className={style.new_period_time_filler} />
                        <InputControl
                          label={t("ExercisePlan.rest")}
                          isEmpty={exe.rest.length < 1 || exe.rest === "not provided - 43S24Uvaui"}
                          isError={false}
                          className={style.input_control_exe}
                        >
                          <input
                            className={style.exe_sets_reps_resist_input}
                            type="text"
                            value={exe.rest === "not provided - 43S24Uvaui" ? "" : exe.rest}
                            onChange={(evt) =>
                              this.handleUpdate(
                                evt,
                                "exercise_rest",
                                periodIndex,
                                workoutIndex,
                                exerciseIndex,
                                "exercise form the list  on change"
                              )
                            }
                            onBlur={(e) =>
                              this.handleAddExerciseToWorkout(
                                e,
                                workoutIndex,
                                periodIndex,
                                exerciseIndex,
                                false,
                                true
                              )
                            }
                          />
                        </InputControl>
                        <span className={style.new_period_time_filler} />
                        <button
                          className={style.add_exe_info_button}
                          onClick={() =>
                            this.handleAddInfoClick(
                              false,
                              exe,
                              periodIndex,
                              workoutIndex,
                              exerciseIndex
                            )
                          }
                        >
                          {t("ExercisePlan.add-info")}
                        </button>
                        {/*<span className={style.new_period_time_filler} />*/}
                        {/*<button className={style.add_exe_superset_button}>Super set</button>*/}
                      </form>
                    </div>
                  ))}

                  {/**/}
                  {/**/}
                  {/* CREATE NEW EXERCISE FORM */}
                  {/**/}
                  {/**/}
                  {true && (
                    <ExerciseForm
                      periodIndex={this.state.periodIndex}
                      workoutIndex={this.state.workoutIndex}
                      newExeIDSelected={this.state.newExeIDSelected}
                      exerciseList={this.state.exerciseList}
                      isEmptySets={this.state.isEmptySets}
                      exerciseSets={this.state.exerciseSets}
                      exerciseReps={this.state.exerciseReps}
                      exerciseRest={this.state.exerciseRest}
                      isEmptyResistance={this.state.isEmptyResistance}
                      handleSubmit={this.handleCreateNewExercise}
                      handleExerciseSelect={this.handleExerciseSelect}
                      handleExerciseInfoClick={this.handleExerciseInfoClick}
                      handleInput={this.handleInput}
                      handleAddInfoClick={this.handleAddInfoClick}
                    />
                  )}

                  {!this.state.showPeriodForm && !this.state.showWorkoutForm && (
                    <div className={style.button_container}>
                      {this.state.showExerciseForm &&
                        this.state.addExerciseToWorkoutIndex ===
                          periodIndex + "-" + workoutIndex && (
                          <button
                            className={`${style.add_workout_button}  ${style.save}`}
                            onClick={(e) =>
                              this.handleAddExerciseToWorkout(
                                e,
                                workoutIndex,
                                periodIndex,
                                -1,
                                false,
                                false
                              )
                            }
                          >
                            {t("ExercisePlan.save-exe")}
                          </button>
                        )}

                      {!this.state.showExerciseForm && (
                        <button
                          className={`${style.add_workout_button}`}
                          onClick={() => this.handleShowExerciseForm(periodIndex, workoutIndex)}
                        >
                          {t("ExercisePlan.add-exe")} {workoutIndex + 1}
                        </button>
                      )}
                      <span className={style.workout_filler} />

                      {this.state.showExerciseForm &&
                        this.state.addExerciseToWorkoutIndex ===
                          periodIndex + "-" + workoutIndex && (
                          <button
                            className={style.cancel}
                            onClick={() => this.handleExerciseCancel()}
                          >
                            {t("ExercisePlan.cancel")}
                          </button>
                        )}
                    </div>
                  )}
                </div>
              ))}
              {/**/}
              {/**/}
              {/* CREATE NEW WORKOUT FORM */}
              {/**/}
              {/**/}
              <div
                className={`${style.workout_header} ${style.workout_list_new}`}
                style={
                  this.state.showWorkoutForm &&
                  this.state.showWorkoutFormForThePeriod === periodIndex
                    ? {}
                    : { display: "none" }
                }
              >
                <div className={style.collapse_icon_wrapper_workout}>
                  <FontAwesomeIcon
                    icon={
                      this.state.periodCollapseIndex.includes(periodIndex)
                        ? faAngleRight
                        : faAngleDown
                    }
                    size="2x"
                  />
                  <h1 className={style.workout_number}>
                    {t("ExercisePlan.workout")} {period.workouts.length + 1}
                  </h1>
                </div>

                <form className={style.form_workout}>
                  <InputControl
                    label={
                      !this.state.isNewWorkoutNameEmpty
                        ? t("ExercisePlan.workout-name")
                        : t("ExercisePlan.workout-name-required")
                    }
                    isEmpty={this.state.newWorkoutName.length < 1}
                    isError={this.state.isNewWorkoutNameEmpty}
                    className={style.input_control_workout_name}
                  >
                    <input
                      ref={this.workoutNameRef}
                      className={`${style.new_workout_name} ${
                        this.state.isNewWorkoutNameEmpty ? style.input_error_border : ""
                      }`}
                      type="text"
                      value={this.state.newWorkoutName}
                      onChange={(evt) => this.handleInput(evt, "workout_name")}
                    />
                  </InputControl>
                  <span className={style.workout_filler} />
                  <InputControl
                    label={
                      !this.state.isNewWorkOutDescEmpty
                        ? t("ExercisePlan.workout-desc")
                        : t("ExercisePlan.workout-desc-required")
                    }
                    isEmpty={this.state.newWorkoutDesc.length < 1}
                    isError={this.state.isNewWorkOutDescEmpty}
                    className={style.input_control_workout_desc}
                  >
                    <input
                      className={`${style.new_workout_description} ${
                        this.state.isNewWorkOutDescEmpty ? style.input_error_border : ""
                      }`}
                      value={this.state.newWorkoutDesc}
                      onChange={(evt) => this.handleInput(evt, "workout_desc")}
                    />
                  </InputControl>
                </form>
              </div>
              {/*Most out side add workout button*/}
              {!this.state.showPeriodForm &&
                !this.state.noPeriodsFound &&
                !this.state.showExerciseForm && (
                  <div className={style.button_container}>
                    {this.state.showWorkoutForm &&
                      this.state.showWorkoutFormForThePeriod === periodIndex && (
                        <button
                          className={`${style.add_workout_button}  ${style.save}`}
                          onClick={(e) =>
                            this.handleAddWorkoutToPeriod(
                              e,
                              periodIndex,
                              period.workouts.length + 1,
                              true,
                              false,
                              false,
                              "create new button"
                            )
                          }
                        >
                          {t("ExercisePlan.save-workout")}
                        </button>
                      )}

                    {!this.state.showWorkoutForm && (
                      <button
                        className={`${style.add_workout_button}`}
                        onClick={() => this.handleShowWorkoutForm(periodIndex)}
                      >
                        {t("ExercisePlan.add-workout")} {periodIndex + 1}
                      </button>
                    )}
                    <span className={style.button_separator} />
                    {this.state.showWorkoutForm &&
                      this.state.showWorkoutFormForThePeriod === periodIndex && (
                        <button className={style.cancel} onClick={() => this.handleWorkoutCancel()}>
                          {t("ExercisePlan.cancel")}
                        </button>
                      )}
                  </div>
                )}
            </div>
          ))}
        </div>

        {/**/}
        {/**/}
        {/* ADD NEW PERIOD FORM*/}
        {/**/}
        {/**/}
        <div
          className={style.add_new_period_wrapper}
          style={this.state.showPeriodForm ? {} : { display: "none" }}
        >
          <div className={style.collapse_icon_wrapper_workout}>
            <h1 className={style.workout_number}>Period {this.state.periodList.length + 1}</h1>
          </div>
          <form
            onSubmit={(event) => this.handleCreateNewWorkout(event)}
            className={style.form_workout}
          >
            <InputControl
              label={
                this.state.isNewPeriodNameEmpty
                  ? t("ExercisePlan.period-name-required")
                  : t("ExercisePlan.period-name")
              }
              isEmpty={this.state.newPeriodName.length < 1}
              isError={this.state.isNewPeriodNameEmpty}
              className={style.input_control_workout_name}
            >
              <input
                className={style.new_workout_name}
                type="text"
                value={this.state.newPeriodName}
                onChange={(evt) => this.handleInput(evt, "period_name")}
              />
            </InputControl>
            <span className={style.workout_filler} />
            <InputControl
              label={t("ExercisePlan.period-desc")}
              isEmpty={this.state.newPeriodDesc.length < 1}
              isError={this.state.isNewPeriodDesEmpty}
              className={style.input_control_workout_desc}
            >
              <input
                className={style.new_workout_description}
                value={this.state.newPeriodDesc}
                onChange={(evt) => this.handleInput(evt, "period_desc")}
              />
            </InputControl>
          </form>
        </div>

        {!this.state.showWorkoutForm && !this.state.showExerciseForm && (
          <div className={style.button_container}>
            {(this.state.showPeriodForm || this.state.noPeriodsFound) && (
              <button
                className={`${style.add_period_button} ${style.save}`}
                onClick={() => (this.state.noPeriodsFound ? {} : this.handlePeriod(-1, true))}
              >
                {t("ExercisePlan.save-period")}
              </button>
            )}

            {!this.state.showPeriodForm && !this.state.noPeriodsFound && (
              <button className={style.add_period_button} onClick={() => this.handleShowPeriod()}>
                {t("ExercisePlan.add-new-period")}
              </button>
            )}
            <span className={style.workout_filler} />
            {this.state.showPeriodForm && (
              <button
                className={`${style.add_period_button} ${style.cancel_period}`}
                onClick={() => this.handlePeriodCancel()}
              >
                {t("ExercisePlan.cancel")}
              </button>
            )}
          </div>
        )}

        {this.state.showAddInfoPopup && (
          <div className={style.add_info_popup} onClick={() => this.handlePopupClose()}>
            <div className={style.popup} onClick={(e) => e.stopPropagation()}>
              <div className={style.popup_header}>{t("ExercisePlan.add-exercise-info")}</div>
              <div className={style.popup_content}>
                <InputControl
                  label={t("ExercisePlan.exe-info")}
                  isEmpty={this.state.addExeInfo.length < 1}
                  isError={false}
                  centerLabel={false}
                  className={style.input_control}
                >
                  <textarea
                    rows="5"
                    className={style.exercise_info}
                    value={
                      this.state.addExeInfo === "not provided - 43S24Uvaui"
                        ? ""
                        : this.state.addExeInfo
                    }
                    onChange={(evt) =>
                      this.handleUpdate(evt, "exercise_info", -1, -1, -1, "name list on change")
                    }
                  />
                </InputControl>
                <button className={style.btn_main} onClick={(e) => this.handleAddInfoBlur(e)}>
                  {t("ExercisePlan.add-exercise-info")}
                </button>
              </div>
            </div>
          </div>
        )}

        {this.state.showExerciseInfoPopup && (
          <div className={style.add_info_popup} onClick={() => this.handlePopupClose()}>
            <div className={style.exe_info_container}>
              <div className={style.exe_info_header}>{this.state.exerciseInfoObject.name}</div>
              <div className={style.exe_info_video}>
                <YouTube
                  videoId={this.getVideoID(this.state.exerciseInfoObject.video)}
                  opts={this.state.videoOpts}
                  onReady={this.handleVideoReady}
                />
              </div>
              <div className={style.exe_info_description}>
                {this.state.exerciseInfoObject.description}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

PeriodWorkoutView.propTypes = {
  createPeriod: PropTypes.element.isRequired && PropTypes.func,
  updatePeriod: PropTypes.element.isRequired && PropTypes.func,
  deletePeriod: PropTypes.element.isRequired && PropTypes.func,
  createWorkout: PropTypes.element.isRequired && PropTypes.func,
  updateWorkout: PropTypes.element.isRequired && PropTypes.func,
  updateWorkoutOrder: PropTypes.element.isRequired && PropTypes.func,
  deleteWorkout: PropTypes.element.isRequired && PropTypes.func,
  getExerciseListForDropDown: PropTypes.element.isRequired && PropTypes.func,
  createExercise: PropTypes.element.isRequired && PropTypes.func,
  updateExercise: PropTypes.element.isRequired && PropTypes.func,
  deleteExercise: PropTypes.element.isRequired && PropTypes.func,
  duplicateExerciseResources: PropTypes.element.isRequired && PropTypes.func,
  coachExercisePlanState: PropTypes.element.isRequired && PropTypes.object,
  token: PropTypes.element.isRequired && PropTypes.string,
  data: PropTypes.array.isRequired,
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
    {
      createPeriod,
      updatePeriod,
      deletePeriod,
      createWorkout,
      updateWorkout,
      updateWorkoutOrder,
      deleteWorkout,
      getExerciseListForDropDown,
      createExercise,
      updateExercise,
      deleteExercise,
      duplicateExerciseResources,
    },
    dispatch
  );
};

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(React.memo(PeriodWorkoutView))
);
