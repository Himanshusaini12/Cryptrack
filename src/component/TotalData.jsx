import React, { useState, useEffect } from 'react';

const API_URL = 'https://source.api.nodeshub.online/cosmos/staking/v1beta1/validators/sourcevaloper1zvuyw9utsdp3w0mnrructw87p8sy8a3su645wj/delegations';

const TotalData = () => {
  const [delegations, setDelegations] = useState([]);
  const [totalDelegations, setTotalDelegations] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setDelegations(data.delegation_responses);
        setTotalDelegations(data.pagination.total);

        const totalAmountValue = data.delegation_responses.reduce(
          (sum, delegation) => sum + parseInt(delegation.balance.amount),
          0
        );
        setTotalAmount(totalAmountValue);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Delegation Information</h2>
      <p>Total Delegations: {totalDelegations}</p>
      <p>Total Amount Delegated: {totalAmount} </p>
    </div>
  );
};

export default TotalData;