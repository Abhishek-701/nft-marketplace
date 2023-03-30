import { MetaMaskInpageProvider } from "@metamask/providers";
import { Contract, ethers, providers } from "ethers";

declare global {
    interface Window {
      ethereum: MetaMaskInpageProvider;
    }
  }

export type Web3Params = {
  ethereum: MetaMaskInpageProvider | null;
  provider: providers.Web3Provider | null;
  contract: Contract | null;
}

export type Web3State = {
  isLoading: boolean; // true while loading web3State
} & Web3Params

export const createDefaultState = () => {
  return {
    ethereum: null,
    provider: null,
    contract: null,
    isLoading: true,
  }
}

const NETWORD_ID = process.env.NEXT_PUBLIC_NETWORK_ID;

export const loadContract =async (name: string , provider : providers.Web3Provider) : Promise<Contract> => {
  if(!NETWORD_ID){
    return Promise.reject("Network ID not defined");
  }

  const res = await fetch ( `/contracts/${name}.json`)
  const Artifact = await res.json();

  if (Artifact.networks[NETWORD_ID].address){
    const contract = new ethers.Contract(
      Artifact.networks[NETWORD_ID].address,
      Artifact.abi , 
      provider
    )

    return contract;
  }else{
    return Promise.reject(`Contract: ${name} cannot be laoded!`)
  }
} 