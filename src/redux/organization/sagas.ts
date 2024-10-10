import { SagaAction } from "@/types/redux";
import { createAction, runEffect } from "@/utilities/actionUtility";
import {
  getPreferenceValueFromStorage,
  setPreferenceValueInStorage,
} from "@/utilities/localStorage";
import { LOCAL_STORAGE_KEYS } from "@/config/consts";
import URLParamsConstant from "@/config/URLParamsConstant";
import { all, call, cancel, put, takeEvery } from "redux-saga/effects";
import FarmActions from "../farm/action";
import { store } from "../store";
import OrganizationActions from "./actions";
import OrganizationEffects from "./effects";

function* REQUEST_ORGANIZATION(action: SagaAction): Generator {
  yield call(runEffect, action, OrganizationEffects.requestOrganization);
}

function* SELECT_ORGANIZATION(action: SagaAction): Generator {
  // const urlParameter = {
  //   [URLParamsConstant.FARM_ID]: action.payload,
  // }
  // setURLParameters(urlParameter)

  if (!action.payload.isFromRefresh) {
    yield call(setPreferenceValueInStorage, LOCAL_STORAGE_KEYS.farm, null);
    store.dispatch(createAction(FarmActions.REQUEST_FARMS_FINISHED, []));
  }

  yield call(
    setPreferenceValueInStorage,
    LOCAL_STORAGE_KEYS.organization,
    action.payload.organizationId
  );

  store.dispatch(createAction(FarmActions.REQUEST_FARMS_FINISHED, []));
}

function* GET_ORGANIZATION_FROM_STORAGE(): Generator {
  const searchParams = new URLSearchParams(window.location.search);
  const organization = searchParams.get(URLParamsConstant.ORGANIZATION_ID);

  if (organization) {
    yield put(OrganizationActions.selectOrganization(organization, true));
    yield cancel();
  }

  const organizationPreference: any = yield getPreferenceValueFromStorage(
    LOCAL_STORAGE_KEYS.organization
  );

  yield put(
    OrganizationActions.selectOrganization(
      typeof organizationPreference === "string" ? organizationPreference : "",
      true
    )
  );
}

export default function* rootSaga(): Generator {
  yield all([
    takeEvery(OrganizationActions.REQUEST_ORGANIZATION, REQUEST_ORGANIZATION),
    takeEvery(OrganizationActions.SELECT_ORGANIZATION, SELECT_ORGANIZATION),
    takeEvery(
      OrganizationActions.GET_ORGANIZATION_FROM_STORAGE,
      GET_ORGANIZATION_FROM_STORAGE
    ),
  ]);
}
