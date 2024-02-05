import { configureStore } from '@reduxjs/toolkit'
import profileReducer from '../redux_slices/profileSlice'
import profileTypeReducer from '../redux_slices/profileTypeSlice'
import orgProfileReducer from '../redux_slices/organisationProfileSlice'

export const store = configureStore({
  reducer: {
    ownProfile: profileReducer,
    profileType: profileTypeReducer,
    orgProfile: orgProfileReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch