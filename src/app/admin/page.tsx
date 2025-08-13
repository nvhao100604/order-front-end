'use client'

import { decrement, increment } from "@/redux/slices/counterSlices"
import { RootState } from "@/redux/store"
import { useDispatch, useSelector } from "react-redux"

const Admin = () => {
    const count = useSelector((state: RootState) => state.counter.value)
    const dispatch = useDispatch();
    return (
        <>
            <div>Hello admin</div>
            <div>
                <button
                    className="bg-red-400 py-4 px-4"
                    onClick={() => dispatch(increment())}
                >Increase</button>
                <button
                    className="bg-blue-400 py-4 px-4"
                    onClick={() => dispatch(decrement())}
                >Decrease</button>
                <br />
                <p>Count = {count}</p>
            </div>
        </>
    )
}

export default Admin