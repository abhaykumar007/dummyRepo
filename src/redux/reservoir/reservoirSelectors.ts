import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { reservoirDenormalizeSchema } from "./Schema";
import { normalizeData } from "@/types/normalize";

export default class ReservoirSelectors {
  static SelectReservoirList = (state: RootState): normalizeData =>
    state?.reservoirs?.reservoirs;

  static SelectDenormalizeReservoir = createSelector(
    (state) => state?.reservoirs?.reservoirs,
    (normalizedReservoirs) =>
      reservoirDenormalizeSchema(normalizedReservoirs) || []
  );

  static SelectSelectedReservoir = (state: RootState) =>
    state?.reservoirs?.selectedReservoir;
}
