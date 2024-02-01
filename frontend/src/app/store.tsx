import { configureStore } from '@reduxjs/toolkit'
import profileReducer from '../redux_slices/profileSlice'
import profileTypeReducer from '../redux_slices/profileTypeSlice'

export const store = configureStore({
  reducer: {
    ownProfile: profileReducer,
    profileType: profileTypeReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch