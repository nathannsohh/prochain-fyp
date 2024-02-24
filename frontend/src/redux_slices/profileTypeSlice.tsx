import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const profileTypeSlice = createSlice({
    name: 'profileType',
    initialState: -1,
    reducers: {
        updateType: (state, action: PayloadAction<number>) => {
            if (action.payload === undefined) {
                return 0
            } else {
                return action.payload
            }
        },
    }
})

export const { updateType } = profileTypeSlice.actions

export default profileTypeSlice.reducer