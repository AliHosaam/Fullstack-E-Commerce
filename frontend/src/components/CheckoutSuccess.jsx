import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { useEffect } from "react";
import { clearCart, getTotal } from "../features/cartSlice";

const CheckoutSuccess = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(clearCart());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getTotal());
  }, [cartItems, dispatch]);

  return (
    <Container>
      <h2>Checkout Successful</h2>
      <p>Your order may take sometime to process...</p>
      <p>Check your order status at your profile after 10mins.</p>
      <p>
        Incase of any inquires contact the support at{" "}
        <strong>support@e-commerce.com</strong>
      </p>
    </Container>
  );
};

const Container = styled.div`
  min-height: 80vh;
  max-width: 800px;
  width: 100%;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  h2 {
    margin-bottom: 0.2rem;
    color: #029e02;
  }
`;

export default CheckoutSuccess;
