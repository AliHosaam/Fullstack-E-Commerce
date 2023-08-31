import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseURL } from "./api";
import { toast } from "react-toastify";

const initialState = {
  list: [],
  status: null,
  editStatus: null,
};

export const ordersFetch = createAsyncThunk("orders/ordersFetch", async () => {
  try {
    const response = await axios.get(`${baseURL}/orders`);

    return response.data;
  } catch (error) {
    console.log(error);
  }
});

export const ordersEdit = createAsyncThunk(
  "orders/ordersEdit",
  async (values, { getState }) => {
    try {
      const state = getState();

      let currentOrder = state.orders.list.filter(
        (order) => order._id === values._id
      );

      const newOrder = {
        ...currentOrder[0],
        delivery_status: values.delivery_status,
      };

      const response = await axios.put(
        `${baseURL}/orders/${values.id}`,
        newOrder
      );

      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: {
    // Orders fetch
    [ordersFetch.pending]: (state, action) => {
      state.status = "pending";
    },
    [ordersFetch.fulfilled]: (state, action) => {
      state.status = "success";
      state.list = action.payload;
    },
    [ordersFetch.rejected]: (state, action) => {
      state.status = "rejected";
    },

    // Orders edit
    [ordersEdit.pending]: (state, action) => {
      state.editStatus = "pending";
    },
    [ordersEdit.fulfilled]: (state, action) => {
      const editedOrders = state.list.map((order) =>
        order._id === action.payload._id ? action.payload : order
      );

      state.list = editedOrders;
      state.editStatus = "success";
      toast.info("Product Edited");
    },
    [ordersEdit.rejected]: (state, action) => {
      state.editStatus = "rejected";
    },
  },
});

export default ordersSlice.reducer;
