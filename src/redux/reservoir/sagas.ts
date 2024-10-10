import { all, call, cancel, put, select, takeEvery } from "redux-saga/effects";
import { runEffect } from "@/utilities/actionUtility";
import { SagaAction } from "@/types/redux";
import ReservoirActions from "./action";
import ReservoirEffects from "./effects";
import { Reservoir } from "@/pages/reservoirs/types";
import ErrorModel from "@/models/error/errorModel";
import { resultHasError } from "@/utilities/onError";
import { normalizeData } from "@/types/normalize";
import ReservoirSelectors from "./reservoirSelectors";
import { successToast } from "@/utilities/toast";
import { getTranslation } from "@/translation/i18n";

function* REQUEST_RESERVOIR(action: SagaAction) {
  yield call(runEffect, action, ReservoirEffects.getReservoir);
}

function* ADD_RESERVOIR(action: SagaAction) {
  const { payload } = action;
  yield call(runEffect, action, ReservoirEffects.addReservoir, payload);
}

function* UPDATE_RESERVOIR(action: SagaAction) {
  const result: Reservoir | ErrorModel = yield call(
    runEffect,
    action,
    ReservoirEffects.updateReservoir,
    action.payload.reservoirId,
    action.payload.reservoir
  );
  if (resultHasError(result as ErrorModel)) yield cancel();

  const reservoirs: normalizeData = yield select(
    ReservoirSelectors.SelectReservoirList
  );
  const updatedReservoirs = {
    entities: {
      reservoirs: {
        ...reservoirs.entities.reservoirs,
        [action.payload.reservoirId]: result,
      },
    },
    result: reservoirs.result,
  };

  yield put(
    ReservoirActions.updateReservoirLocally(
      result as Reservoir,
      updatedReservoirs
    )
  );
}

function* DELETE_RESERVOIR(action: SagaAction) {
  const { reservoirId } = yield select(
    ReservoirSelectors.SelectSelectedReservoir
  );

  const result: Reservoir | ErrorModel = yield call(
    runEffect,
    action,
    ReservoirEffects.deleteReservoir,
    reservoirId
  );
  if (resultHasError(result as ErrorModel)) yield cancel();

  const reservoirs: normalizeData = yield select(
    ReservoirSelectors.SelectReservoirList
  );

  const updatedResult = (reservoirs.result as string[]).filter(
    (id: string) => id !== reservoirId
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [reservoirId]: _, ...newReservoirEntities } =
    reservoirs.entities.reservoirs;

  const updatedReservoirs = {
    entities: {
      reservoirs: { ...newReservoirEntities },
    },
    result: updatedResult,
  };

  successToast(getTranslation("reservoir.reservoirDeleteText"));

  yield put(ReservoirActions.updateReservoirLocally(null, updatedReservoirs));
}

export default function* rootSaga() {
  yield all([
    takeEvery(ReservoirActions.REQUEST_RESERVOIR, REQUEST_RESERVOIR),
    takeEvery(ReservoirActions.ADD_RESERVOIR, ADD_RESERVOIR),
    takeEvery(ReservoirActions.UPDATE_RESERVOIR, UPDATE_RESERVOIR),
    takeEvery(ReservoirActions.DELETE_RESERVOIR, DELETE_RESERVOIR),
  ]);
}
