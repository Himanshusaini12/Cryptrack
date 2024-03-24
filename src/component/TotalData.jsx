import React, { useState, useEffect } from 'react';
import './TotalData.css';

const fetchChainData = async (chainName, validatorAddress, walletAddress, apiUrl) => {
  try {
    const delegationsUrl = `${apiUrl}/cosmos/staking/v1beta1/validators/${validatorAddress}/delegations`;
    const validatorsUrl = `${apiUrl}/cosmos/staking/v1beta1/delegators/${walletAddress}/validators`;

    // Fetch delegations data
    const delegationsResponse = await fetch(delegationsUrl);
    const delegationsData = await delegationsResponse.json();
    const delegations = delegationsData.delegation_responses;
    const totalDelegations = delegationsData.pagination.total;

    // Fetch validators data
    const validatorsResponse = await fetch(validatorsUrl);
    const validatorsData = await validatorsResponse.json();

    // Extract tokens value and divide by 1,000,000
    let tokens = 0;
    let usdAmount = 0;
    let inrAmount = 0;

    if (validatorsData.validators.length > 0) {
      const rawTokens = validatorsData.validators[0].tokens;
      tokens = parseInt(rawTokens) / 1000000;

      // Calculate USD amount
      usdAmount = tokens * 1; // Assuming 1 token = 1 USD

      // Calculate INR amount (assuming 1 USD = 90 INR)
      inrAmount = usdAmount * 90;
    }

    return { chainName, delegations, totalDelegations, tokens, usdAmount, inrAmount };
  } catch (error) {
    console.error(`Error fetching ${chainName} data:`, error);
    return { chainName, delegations: [], totalDelegations: 0, tokens: 0, usdAmount: 0, inrAmount: 0 };
  }
};

const DelegationInfo = () => {
  const [chainData, setChainData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const sourceData = await fetchChainData(
        'Source',
        'sourcevaloper1zvuyw9utsdp3w0mnrructw87p8sy8a3su645wj',
        'source1zvuyw9utsdp3w0mnrructw87p8sy8a3suyny4s',
        'https://source.api.nodeshub.online'
      );

      const firmachainData = await fetchChainData(
        'Firmachain',
        'firmavaloper1hq5rh4p2whhx7ctjn6gjdz3kx9tfzcw2kkt79c',
        'firma1hq5rh4p2whhx7ctjn6gjdz3kx9tfzcw2g9q99k',
        'https://firmachain.api.nodeshub.online'
      );

      const chihuahuaData = await fetchChainData(
        'Chihuahua',
        'chihuahuavaloper1zvuyw9utsdp3w0mnrructw87p8sy8a3s248fhs',
        'chihuahua1zvuyw9utsdp3w0mnrructw87p8sy8a3sez85yv',
        'https://chihuahua.api.nodeshub.online'
      );

      const zetaData = await fetchChainData(
        'Zetachain',
        'zetavaloper1mgukftytaqvwew57qvqz8yv380vhh8zs23qfx4',
        'zeta1mgukftytaqvwew57qvqz8yv380vhh8zsw3c4tr',
        'https://zeta.api.nodeshub.online'
      );

      const humansData = await fetchChainData(
        'Humans',
        'humanvaloper1xnrgrnvs0t2dy8z86sgfzgu0t6t26ezr0et7r5',
        'human1xnrgrnvs0t2dy8z86sgfzgu0t6t26ezrr233g3',
        'https://humans.api.nodeshub.online'
      );

      const govgenData = await fetchChainData(
        'Govgen',
        'govgenvaloper1zvuyw9utsdp3w0mnrructw87p8sy8a3snv9wxv',
        'govgen1zvuyw9utsdp3w0mnrructw87p8sy8a3szwv0vk',
        'https://govgen.api.nodeshub.online'
      );

      const fetchaiData = await fetchChainData(
        'Fetchai',
        'fetchvaloper1a2vqt89mp4hq7uh6sna3n80yv99ejluasdkpdp',
        'fetch1a2vqt89mp4hq7uh6sna3n80yv99ejlua4ffz7x',
        'https://fetch.api.nodeshub.online'
      );

      const sentinielhubData = await fetchChainData(
        'Sentinielhub',
        'sentvaloper12shx6mcced36gkvd8dn7xy2gq3wfudn7lxv22u',
        'sent12shx6mcced36gkvd8dn7xy2gq3wfudn7qrn894',
        'https://sentinel.api.nodeshub.online'
      );

      const junoData = await fetchChainData(
        'Juno',
        'junovaloper1zvuyw9utsdp3w0mnrructw87p8sy8a3snclwet',
        'juno1zvuyw9utsdp3w0mnrructw87p8sy8a3sv9fpzj',
        'https://juno.api.nodeshub.online'
      );

      const bitcannaData = await fetchChainData(
        'Bitcanna',
        'bcnavaloper182dfunl7j9wpdqjlpkgq4se497f0uty4nnlfzy',
        'bcna182dfunl7j9wpdqjlpkgq4se497f0uty42wwfcs',
        'https://bitcanna-api.polkachu.com'
      );

      const furyData = await fetchChainData(
        'Fury',
        'furyavaloper1yasjpwlug8355auvle465lp3k3y0yhuuc7ymvl',
        'furya1yasjpwlug8355auvle465lp3k3y0yhuuqufxwp',
        'https://furya.api.nodeshub.online'
      );

      const nibiData = await fetchChainData(
        'Nibi',
        'nibivaloper12zgp6aap9ln0n02u5yn9j6gsl50upnu7aeu33j',
        'nibi12zgp6aap9ln0n02u5yn9j6gsl50upnu75zj290',
        'https://nibiru.api.nodeshub.online'
      );

      setChainData([
        sourceData,
        firmachainData,
        chihuahuaData,
        zetaData,
        humansData,
        govgenData,
        fetchaiData,
        sentinielhubData,
        junoData,
        bitcannaData,
        furyData,
        nibiData,
      ]);
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
            <th>Total Delegations </th>
            <th>Total Amount (INR)</th>
          </tr>
        </thead>
        <tbody>
          {chainData.map((chain, index) => (
            <tr key={index}>
              <td>{chain.chainName}</td>
              <td>{chain.totalDelegations}</td>
              <td>{chain.usdAmount.toFixed(0)}</td>
              <td>{chain.inrAmount.toFixed(0)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DelegationInfo;