import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useState, useEffect } from "react";
import axios from "axios";
import { baseURL } from "../../features/api";

const Order = () => {
  const [order, setOrder] = useState({});
  const [loading, setLoading] = useState(false);

  const params = useParams();

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/orders/findOne/${params.id}`
        );
        setOrder(response.data);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };

    fetchData();
  }, [params.id]);

  return (
    <StyledOrder>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <OrdersContainer>
            <h2>Order Details</h2>
            <p>
              {order.delivery_status === "pending" ? (
                <Pending>Pending</Pending>
              ) : order.delivery_status === "dispatched" ? (
                <Dispatched>Dispatch</Dispatched>
              ) : order.delivery_status === "delivered" ? (
                <Delivered>Deliver</Delivered>
              ) : (
                "error"
              )}
            </p>

            <h3>Ordered Products</h3>
            <Items>
              {order.products.map((product, index) => (
                <Item key={index}>
                  <span>{product.description}</span>
                  <span>{product.quantity}</span>
                  <span>
                    {"$" + (product.amount_total / 100).toLocaleString()}
                  </span>
                </Item>
              ))}
            </Items>
            <div>
              <h3>Total Price</h3>
              <p>{"$" + (order.total / 100).toLocaleString()}</p>
            </div>
            <div>
              <h3>Shipping Details</h3>
              <p>Customer: {order.shipping?.name}</p>
              <p>City: {order.shipping?.address.city}</p>
              <p>Email: {order.shipping?.email}</p>
            </div>
          </OrdersContainer>
        </>
      )}
    </StyledOrder>
  );
};

const StyledOrder = styled.div`
  margin: 3rem;
  display: flex;
  justify-content: center;
  h3 {
    margin: 1.5rem 0 0.5rem 0;
  }
`;

const OrdersContainer = styled.div`
  max-width: 500px;
  width: 100%;
  height: auto;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  border-radius: 5px;
  padding: 2rem;
`;

const Items = styled.div`
  margin-right: 1.5rem;
  &:first-child {
    font-weight: bold;
  }
`;

const Item = styled.li`
  margin-left: 0.5rem;
  margin-bottom: 0.5rem;
`;

const Pending = styled.span`
  color: rgb(253, 181, 40);
  background-color: rgba(253, 181, 40, 0.12);
  padding: 3px 5px;
  border-radius: 3px;
  font-size: 14px;
`;

const Dispatched = styled.span`
  color: rgb(38, 198, 249);
  background-color: rgba(38, 198, 249, 0.12);
  padding: 3px 5px;
  border-radius: 3px;
  font-size: 14px;
`;

const Delivered = styled.span`
  color: rgb(102, 108, 255);
  background-color: rgba(102, 108, 255, 0.12);
  padding: 3px 5px;
  border-radius: 3px;
  font-size: 14px;
`;

export default Order;
