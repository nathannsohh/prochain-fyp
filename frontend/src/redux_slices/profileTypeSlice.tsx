import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const profileTypeSlice = createSlice({
    name: 'profileType',
    initialState: 1,
    reducers: {
        updateType: (state, action: PayloadAction<number>) => {
            state = action.payload
        },
    }
})

export const { updateType } = profileTypeSlice.actions

export default profileTypeSlice.reducer