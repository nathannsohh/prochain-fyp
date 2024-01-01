import { configureStore } from '@reduxjs/toolkit'
import profileReducer from './profile/profileSlice'

export const store = configureStore({
  reducer: {
    ownProfile: profileReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch