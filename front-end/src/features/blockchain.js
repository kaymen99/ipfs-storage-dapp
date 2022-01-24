import { createSlice } from '@reduxjs/toolkit';

const initialStateValue = { account: "", balance: 0, network: "" }
export const blockchainSlice = createSlice({
    name: "blockchain",
    initialState: { value: initialStateValue },
    reducers: {
        connect: (state, action) => {
            state.value = action.payload
        },
        disconnect: (state) => {
            state.value = initialStateValue
        }
    },
}
)

export default blockchainSlice.reducer;

export const { connect, disconnect } = blockchainSlice.actions;
