import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Patient from "../../interfaces/Patient";

interface PatientState {
    patient: Omit<Patient, "username"> | null;
}

const initialState: PatientState = {
    patient: null,
};

export const patientSlice = createSlice({
    name: "patient",
    initialState,
    reducers: {
      setPatient: (state, action: PayloadAction<Omit<Patient, "username"> | null>) => {
        state.patient = action.payload;
      },
      clearPatient: (state) => {
        state.patient = null;
      },
    },
});
  
export const { setPatient, clearPatient } = patientSlice.actions;
export const selectPatient = (state: { patient: PatientState }) => state.patient.patient;
export default patientSlice.reducer;
