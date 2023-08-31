import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import styled from "styled-components";
import { PrimaryButton } from "./CommonStyled";
import { productsEdit } from "../../features/productsSlice";

export default function EditProduct({ prodId }) {
  const [open, setOpen] = useState(false);
  const [currentProd, setCurrentProd] = useState({});
  const [previewImage, setPreviewImage] = useState("");
  const [productImg, setProductImg] = useState("");
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [des, setDes] = useState("");
  const [price, setPrice] = useState("");

  const { items, editStatus } = useSelector((state) => state.products);
  const dispatch = useDispatch();

  const handleProductImageUpload = (e) => {
    const file = e.target.files[0];

    TransformFile(file);
  };

  const TransformFile = (file) => {
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setProductImg(reader.result);
        setPreviewImage(reader.result);
      };
    } else {
      setProductImg("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      productsEdit({
        productImg,
        product: {
          ...currentProd,
          name: name,
          desc: des,
          price: price,
          brand: brand,
        },
      })
    );
  };

  const handleClickOpen = () => {
    setOpen(true);

    let selectedProd = items.filter((item) => item._id === prodId);

    selectedProd = selectedProd[0];

    setCurrentProd(selectedProd);
    setPreviewImage(selectedProd.image);
    setProductImg("");
    setName(selectedProd.name);
    setDes(selectedProd.desc);
    setPrice(selectedProd.price);
    setBrand(selectedProd.brand);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Edit onClick={handleClickOpen}>Edit</Edit>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth={true}
        maxWidth={"md"}
      >
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <StyledEditProduct>
            <StyledForm onSubmit={handleSubmit}>
              <h3>Create a Product</h3>
              <input
                type="file"
                accept="image/jpeg, image/png, image/gif"
                onChange={handleProductImageUpload}
                required
              />

              <select
                onChange={(e) => setBrand(e.target.value)}
                required
                value={brand}
              >
                <option value="">Select Brand</option>
                <option value="iphone">iPhone</option>
                <option value="samsung">Samsung</option>
                <option value="xiomi">Xiomi</option>
                <option value="other">Other</option>
              </select>

              <input
                type="text"
                required
                placeholder="Name"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />

              <input
                type="text"
                required
                placeholder="Price"
                onChange={(e) => setPrice(e.target.value)}
                value={price}
              />

              <input
                type="text"
                required
                placeholder="Short Description"
                onChange={(e) => setDes(e.target.value)}
                value={des}
              />
              <PrimaryButton type="submit">
                {editStatus === "pending" ? "Submitting" : "Submit"}
              </PrimaryButton>
            </StyledForm>
            <ImagePreview>
              {previewImage ? (
                <>
                  <img src={previewImage} alt="Product" />
                </>
              ) : (
                <p>Image preview will appear here!</p>
              )}
            </ImagePreview>
          </StyledEditProduct>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const Edit = styled.button`
  border: none;
  outline: none;
  padding: 3px 5px;
  color: white;
  border-radius: 3px;
  cursor: pointer;
  background-color: #4b70e2;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 300px;
  margin-top: 2rem;

  select,
  input {
    padding: 7px;
    min-height: 30px;
    outline: none;
    border-radius: 5px;
    border: 1px solid rgb(182, 182, 182);
    margin: 0.3rem 0;

    &:focus {
      border: 2px solid rgb(0, 208, 255);
    }
  }

  select {
    color: rgb(95, 95, 95);
  }
`;

const StyledEditProduct = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ImagePreview = styled.div`
  margin: 2rem 0 2rem 2rem;
  padding: 2rem;
  border: 1px solid rgb(183, 183, 183);
  max-width: 300px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: rgb(78, 78, 78);

  img {
    max-width: 100%;
  }
`;
