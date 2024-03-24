import React, { useState, useEffect } from 'react';
import './TotalData.css';

const DELEGATIONS_API_URL = 'https://source.api.nodeshub.online/cosmos/staking/v1beta1/validators/sourcevaloper1zvuyw9utsdp3w0mnrructw87p8sy8a3su645wj/delegations';
const VALIDATORS_API_URL = 'https://source.api.nodeshub.online/cosmos/staking/v1beta1/delegators/source1zvuyw9utsdp3w0mnrructw87p8sy8a3suyny4s/validators';

const DelegationInfo = () => {
  const [delegations, setDelegations] = useState([]);
  const [totalDelegations, setTotalDelegations] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [tokens, setTokens] = useState('');
  const [usdAmount, setUSDAmount] = useState(0);
  const [inrAmount, setINRAmount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch delegations data
        const delegationsResponse = await fetch(DELEGATIONS_API_URL);
        const delegationsData = await delegationsResponse.json();
        setDelegations(delegationsData.delegation_responses);
        setTotalDelegations(delegationsData.pagination.total);

        // Fetch validators data
        const validatorsResponse = await fetch(VALIDATORS_API_URL);
        const validatorsData = await validatorsResponse.json();

        // Extract tokens value and divide by 1,000,000
        if (validatorsData.validators.length > 0) {
          const rawTokens = validatorsData.validators[0].tokens;
          const tokensInMillions = parseInt(rawTokens) / 1000000;
          setTokens(tokensInMillions);

          // Calculate USD amount
          const usdValue = tokensInMillions * 1; // Assuming 1 token = 1 USD
          setUSDAmount(usdValue);

          // Calculate INR amount (assuming 1 USD = 90 INR)
          const inrValue = usdValue * 90;
          setINRAmount(inrValue);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container">
      <h2>Delegation Information</h2>
      <table className="delegation-table">
        <thead>
          <tr>
            <th>Chain Name</th>
            <th>Delegators</th>
            <th>Total Delegation </th>
            <th>Total Amount (INR)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Source</td>
            <td>{totalDelegations}</td>
            <td>{usdAmount.toFixed(0)}</td>
            <td>{inrAmount.toFixed(0)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DelegationInfo;
