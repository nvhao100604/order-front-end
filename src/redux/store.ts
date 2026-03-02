import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '@/redux/slices/counterSlices'
import cartReducer from './slices/cartSlices'
import authReducer from './slices/authSlices'
import staffReducer from './slices/staffSlice'

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        cart: cartReducer,
        auth: authReducer,
        staff: staffReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST'],
            },
        }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch