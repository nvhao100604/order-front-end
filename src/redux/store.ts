import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '@/redux/slices/counterSlices'
import cartReducer from './slices/cartSlices'
import authReducer from './slices/authSlices'
import staffReducer from './slices/staffSlice'
import { rtkQueryErrorLogger } from './middlewares/errorLogging'

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        cart: cartReducer,
        auth: authReducer,
        staff: staffReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(rtkQueryErrorLogger),
})

store.subscribe(() => {
    console.log("🔔 Store action, auth state:", store.getState().auth.isAuthenticated)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch