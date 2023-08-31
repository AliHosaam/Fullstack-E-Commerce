import styled from "styled-components";
import { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userDelete, usersFetch } from "../../../features/usersSlice";

export default function UsersList() {
  const navigate = useNavigate();
  const { list } = useSelector((state) => state.users);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(usersFetch());
  }, [dispatch]);

  const handleUserDelete = (id) => {
    dispatch(userDelete(id));
  };

  const rows = list?.map((user) => {
    return {
      id: user._id,
      uName: user.name,
      uEmail: user.email,
      isAdmin: user.isAdmin,
    };
  });

  const columns = [
    { field: "id", headerName: "ID", width: 220 },
    {
      field: "uName",
      headerName: "Name",
      width: 150,
    },
    { field: "uEmail", headerName: "Email", width: 200 },
    {
      field: "isAdmin",
      headerName: "Role",
      width: 100,
      renderCell: (params) => {
        return (
          <div>
            {params.row.isAdmin ? (
              <Admin>Admin</Admin>
            ) : (
              <Customer>Customer</Customer>
            )}
          </div>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      width: 120,
      renderCell: (params) => {
        return (
          <Actions>
            <Delete onClick={() => handleUserDelete(params.row.id)}>
              Delete
            </Delete>
            <View onClick={() => navigate(`/user/${params.row.id}`)}>View</View>
          </Actions>
        );
      },
    },
  ];

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        disableSelectionOnClick
      />
    </div>
  );
}

const Actions = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  button {
    border: none;
    outline: none;
    padding: 3px 5px;
    color: white;
    border-radius: 3px;
    cursor: pointer;
  }
`;

const Delete = styled.button`
  background-color: rgb(255, 77, 73);
`;

const View = styled.button`
  background-color: rgb(114, 225, 40);
`;

const Admin = styled.div`
  color: rgb(253, 181, 40);
  background-color: rgba(253, 181, 40, 0.12);
  border-radius: 3px;
  padding: 3px 5px;
  font-size: 14px;
`;

const Customer = styled.div`
  color: rgb(38, 198, 249);
  background-color: rgba(38, 198, 249, 0.12);
  border-radius: 3px;
  padding: 3px 5px;
  font-size: 14px;
`;
