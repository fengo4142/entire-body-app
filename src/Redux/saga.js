import { takeLatest } from "redux-saga/effects";

function* createRequestHandler({ payload }) {}

function* updateRequestHandler({ payload }) {}

export default function* saga() {
  yield takeLatest("CREATE_REQUEST", createRequestHandler);
  yield takeLatest("UPDATE_REQUEST", updateRequestHandler);
}
