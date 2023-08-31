import { useEffect, useState } from "react";
import axios from "axios";
import { baseURL } from "../../../features/api";
import styled from "styled-components";
import moment from "moment";

const Transactions = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${baseURL}/orders/?new=true`);

        setOrders(response.data);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <StyledTransactions>
      {loading ? (
        <p>Transactions is loading</p>
      ) : (
        <>
          <h3>Latest Transactions</h3>
          {orders?.map((order, index) => (
            <Transaction kay={index}>
              <p>{order.shipping.name}</p>
              <p>{(order.total / 100).toLocaleString()}</p>
              <p>{moment(order.createdAt).fromNow()}</p>
            </Transaction>
          ))}
        </>
      )}
    </StyledTransactions>
  );
};

const StyledTransactions = styled.div`
  background: rgb(48, 51, 78);
  color: rgba(234, 234, 255, 0.87);
  padding: 1rem;
  border-radius: 5px;
`;

const Transaction = styled.div`
  display: flex;
  font-size: 14px;
  margin-top: 1rem;
  padding: 0.5rem;
  border-radius: 3px;
  background: rgba(38, 108, 255, 0.12);
  p {
    flex: 1;
  }
  &:nth-child(even) {
    background: rgba(102, 108, 255, 0.12);
  }
`;

export default Transactions;
