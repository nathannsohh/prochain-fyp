import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const profileSlice = createSlice({
    name: 'ownProfile',
    initialState: {
        value: null
    } as ProfileState,
    reducers: {
        updateSelf: (state, action: PayloadAction<UserStateType>) => {
            state.value = action.payload
        },
        removeSelf: (state) => {
            state.value = null
        }
    }
})

export const { updateSelf, removeSelf } = profileSlice.actions

export default profileSlice.reducer