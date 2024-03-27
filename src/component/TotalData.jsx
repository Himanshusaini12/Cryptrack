import React, { useState, useEffect } from 'react';
import './TotalData.css';
import LoadingSpinner from './LoadingSpinner'; // Import your loading spinner component

const fetchTokenPrice = async (tokenId) => {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd&x_cg_demo_api_key=CG-udxCMxXmS8um3t97Zcy3NVDx`
    );
    const data = await response.json();
    return data[tokenId].usd;
  } catch (error) {
    console.error(`Error fetching ${tokenId} price:`, error);
    return 0;
  }
};

const fetchChainData = async (chainName, validatorAddress, walletAddress, apiUrl, tokenId, divisor = 1000000) => {
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

    // Extract tokens value and divide by the divisor
    let tokens = 0;
    let usdAmount = 0;

    if (validatorsData.validators.length > 0) {
      const rawTokens = validatorsData.validators[0].tokens;

      if (chainName === 'Zetachain' || chainName === 'Humans' || chainName === 'Fetchai') {
        tokens = parseInt(rawTokens) / 1000000000000000000;
      } else {
        tokens = parseInt(rawTokens) / divisor;
      }

      // Fetch token price from CoinGecko
      const tokenPrice = await fetchTokenPrice(tokenId);

      // Calculate USD amount
      usdAmount = tokens * tokenPrice;
    }

    return { chainName, delegations, totalDelegations, tokens, usdAmount };
  } catch (error) {
    console.error(`Error fetching ${chainName} data:`, error);
    return { chainName, delegations: [], totalDelegations: 0, tokens: 0, usdAmount: 0 };
  }
};

const AddChainForm = ({ onAddChain }) => {
  const [chainName, setChainName] = useState('');
  const [validatorAddress, setValidatorAddress] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [apiUrl, setApiUrl] = useState('');
  const [tokenId, setTokenId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddChain({ chainName, validatorAddress, walletAddress, apiUrl, tokenId });
    setChainName('');
    setValidatorAddress('');
    setWalletAddress('');
    setApiUrl('');
    setTokenId('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Chain Name:
        <input
          type="text"
          value={chainName}
          onChange={(e) => setChainName(e.target.value)}
          required
        />
      </label>
      <label>
        Validator Address:
        <input
          type="text"
          value={validatorAddress}
          onChange={(e) => setValidatorAddress(e.target.value)}
          required
        />
      </label>
      <label>
        Wallet Address:
        <input
          type="text"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          required
        />
      </label>
      <label>
        API URL:
        <input
          type="text"
          value={apiUrl}
          onChange={(e) => setApiUrl(e.target.value)}
          required
        />
      </label>
      <label>
        Token ID:
        <input
          type="text"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
          required
        />
      </label>
      <button type="submit">Add Chain</button>
    </form>
  );
};

const DelegationInfo = () => {
  const [chainData, setChainData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalDelegators, setTotalDelegators] = useState(0);
  const [totalUSD, setTotalUSD] = useState(0);
  const [userChains, setUserChains] = useState([]);

  useEffect(() => {
    const storedChains = JSON.parse(localStorage.getItem('userChains')) || [];
    setUserChains(storedChains);
  }, []);

  const handleAddChain = (newChain) => {
    const updatedChains = [...userChains, newChain];
    setUserChains(updatedChains);
    localStorage.setItem('userChains', JSON.stringify(updatedChains));
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const sourceData = await fetchChainData(
        'Source',
        'sourcevaloper1zvuyw9utsdp3w0mnrructw87p8sy8a3su645wj',
        'source1zvuyw9utsdp3w0mnrructw87p8sy8a3suyny4s',
        'https://source.api.nodeshub.online',
        'source'
      );

      const firmachainData = await fetchChainData(
        'Firmachain',
        'firmavaloper1hq5rh4p2whhx7ctjn6gjdz3kx9tfzcw2kkt79c',
        'firma1hq5rh4p2whhx7ctjn6gjdz3kx9tfzcw2g9q99k',
        'https://firmachain.api.nodeshub.online',
        'firmachain'
      );

      const chihuahuaData = await fetchChainData(
        'Chihuahua',
        'chihuahuavaloper1zvuyw9utsdp3w0mnrructw87p8sy8a3s248fhs',
        'chihuahua1zvuyw9utsdp3w0mnrructw87p8sy8a3sez85yv',
        'https://chihuahua.api.nodeshub.online',
        'chihuahua-token'
      );

      const zetaData = await fetchChainData(
        'Zetachain',
        'zetavaloper1mgukftytaqvwew57qvqz8yv380vhh8zs23qfx4',
        'zeta1mgukftytaqvwew57qvqz8yv380vhh8zsw3c4tr',
        'https://zeta.api.nodeshub.online',
        'zetachain'
      );

      const humansData = await fetchChainData(
        'Humans',
        'humanvaloper1xnrgrnvs0t2dy8z86sgfzgu0t6t26ezr0et7r5',
        'human1xnrgrnvs0t2dy8z86sgfzgu0t6t26ezrr233g3',
        'https://humans.api.nodeshub.online',
        'humans-ai'
      );

      const govgenData = await fetchChainData(
        'Govgen',
        'govgenvaloper1zvuyw9utsdp3w0mnrructw87p8sy8a3snv9wxv',
        'govgen1zvuyw9utsdp3w0mnrructw87p8sy8a3szwv0vk',
        'https://govgen.api.nodeshub.online',
        'govgen'
      );

      const fetchaiData = await fetchChainData(
        'Fetchai',
        'fetchvaloper1a2vqt89mp4hq7uh6sna3n80yv99ejluasdkpdp',
        'fetch1a2vqt89mp4hq7uh6sna3n80yv99ejlua4ffz7x',
        'https://fetch.api.nodeshub.online',
        'fetch-ai'
      );

      const sentinielhubData = await fetchChainData(
        'Sentinielhub',
        'sentvaloper12shx6mcced36gkvd8dn7xy2gq3wfudn7lxv22u',
        'sent12shx6mcced36gkvd8dn7xy2gq3wfudn7qrn894',
        'https://sentinel.api.nodeshub.online',
        'sentinel'
      );

      const junoData = await fetchChainData(
        'Juno',
        'junovaloper1zvuyw9utsdp3w0mnrructw87p8sy8a3snclwet',
        'juno1zvuyw9utsdp3w0mnrructw87p8sy8a3sv9fpzj',
        'https://juno.api.nodeshub.online',
        'juno-network'
      );

      const bitcannaData = await fetchChainData(
        'Bitcanna',
        'bcnavaloper182dfunl7j9wpdqjlpkgq4se497f0uty4nnlfzy',
        'bcna182dfunl7j9wpdqjlpkgq4se497f0uty42wwfcs',
        'https://bitcanna-api.polkachu.com',
        'bitcanna'
      );

      const furyData = await fetchChainData(
        'Fury',
        'furyavaloper1yasjpwlug8355auvle465lp3k3y0yhuuc7ymvl',
        'furya1yasjpwlug8355auvle465lp3k3y0yhuuqufxwp',
        'https://furya.api.nodeshub.online',
        'fanfury'
      );

      const nibiData = await fetchChainData(
        'Nibi',
        'nibivaloper12zgp6aap9ln0n02u5yn9j6gsl50upnu7aeu33j',
        'nibi12zgp6aap9ln0n02u5yn9j6gsl50upnu75zj290',
        'https://nibiru.api.nodeshub.online',
        'nibiru'
      );

      // Fetch user-added chains
      const fetchedUserChains = await Promise.all(
        userChains.map((chain) =>
          fetchChainData(
            chain.chainName,
            chain.validatorAddress,
            chain.walletAddress,
            chain.apiUrl,
            chain.tokenId
          )
        )
      );

      // Combine existing and user-added chains
      const allChains = [
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
        ...fetchedUserChains,
      ];

      let totalDelegators = 0;
      let totalUSD = 0;

      for (const chain of allChains) {
        totalDelegators += Number(chain.totalDelegations);
        totalUSD += Number(chain.usdAmount);
      }

      setTotalDelegators(totalDelegators);
      setTotalUSD(totalUSD);

      setChainData(allChains);

      setIsLoading(false);
    };

    fetchData();
  }, [userChains]);

  const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="container">
      <h2>Delegation Information</h2>
      
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <table className="delegation-table">
          <thead>
            <tr>
              <th>Chain Name</th>
              <th>Delegators</th>
              <th>Total Amount</th>
              <th>Total Amount (USD)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Total</td>
              <td>{formatNumber(totalDelegators)}</td>
              <td>-</td>
              <td>${formatNumber(totalUSD.toFixed(2))}</td>
            </tr>
            {chainData.map((chain, index) => (
              <tr key={index}>
                <td>{chain.chainName}</td>
                <td>{formatNumber(chain.totalDelegations)}</td>
                <td>{formatNumber(chain.tokens.toFixed(2))}</td>
                <td>${formatNumber(chain.usdAmount.toFixed(2))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <AddChainForm onAddChain={handleAddChain} />
    </div>
  );
};

export default DelegationInfo;