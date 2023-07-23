import { Session } from 'inspector';
import '../styles/globals.css'
import { AppProps } from 'next/app';
import Layout from '@/components/layout/Wrapper';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { arbitrum, mainnet, polygon } from 'wagmi/chains'

const chains = [arbitrum, mainnet, polygon]
const projectId = '5c09c4f76155fab64825de5591ec92d3'

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient
})
const ethereumClient = new EthereumClient(wagmiConfig, chains)

const MyApp = ({
  Component,
  pageProps
}: AppProps<{
  initialSession: Session
}>) => {
  return (
    <Layout>
      <WagmiConfig config={wagmiConfig}>
        <Component {...pageProps} />
      </WagmiConfig>
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />

    </Layout>
  );
}

export default MyApp;
