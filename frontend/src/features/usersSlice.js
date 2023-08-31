import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseURL } from "./api";
import { toast } from "react-toastify";

const initialState = {
  list: [],
  status: null,
  deleteStatus: null,
};

export const usersFetch = createAsyncThunk("users/usersFetch", async () => {
  try {
    const response = await axios.get(`${baseURL}/users`);

    return response.data;
  } catch (error) {
    console.log(error);
  }
});

export const userDelete = createAsyncThunk("users/userDelete", async (id) => {
  try {
    const response = await axios.delete(`${baseURL}/users/${id}`);

    return response.data;
  } catch (error) {
    console.log(error);
    toast.error(error.response?.data, {
      position: "bottom-left",
    });
  }
});

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: {
    // Users fetch
    [usersFetch.pending]: (state, action) => {
      state.status = "pending";
    },
    [usersFetch.fulfilled]: (state, action) => {
      state.status = "success";
      state.list = action.payload;
    },
    [usersFetch.rejected]: (state, action) => {
      state.status = "rejected";
    },

    // Users delete
    [userDelete.pending]: (state, action) => {
      state.deleteStatus = "pending";
    },
    [userDelete.fulfilled]: (state, action) => {
      const newList = state.list.filter(
        (user) => user._id !== action.payload._id
      );

      state.items = newList;
      state.deleteStatus = "success";
      toast.error("Product Deleted", {
        position: "bottom-left",
      });
    },
    [userDelete.rejected]: (state, action) => {
      state.deleteStatus = "rejected";
    },
  },
});

export default usersSlice.reducer;
