import { takeLatest } from "redux-saga/effects";

/**
 * Just for demo purpose
 */

function* createRequestHandler() {}
function* updateRequestHandler() {}

export default function* saga() {
  yield takeLatest("CREATE_REQUEST", createRequestHandler);
  yield takeLatest("UPDATE_REQUEST", updateRequestHandler);
}
