// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import RtlLayout from './components/RtlLayout';
import ScrollToTop from './components/ScrollToTop';
import { ProgressBarStyle } from './components/ProgressBar';
import ThemeColorPresets from './components/ThemeColorPresets';
import MotionLazyContainer from './components/animate/MotionLazyContainer';

// ----------------------------------------------------------------------

//wagmi
import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { polygonAmoy } from 'wagmi/chains'
 
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'


import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { useEffect } from 'react';
// ----------------------------------------------------------------------

//buffer to invoke wallet connect and coinbase popup
// window.Buffer = window.Buffer || require("buffer").Buffer;

const { chains, publicClient, webSocketPublicClient  } = configureChains([polygonAmoy], [
  alchemyProvider({ apiKey: process.env.REACT_APP_AMOY_RPC_URL }),
  publicProvider(), //not to use in production
])

const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
  ],
  publicClient,
  webSocketPublicClient,
})


export default function App() {

   //localstorage clear 24hr

   var hours = 24;
   var now = new Date().getTime();
   var setupTime = localStorage.getItem('access_token');
   var parsed = JSON.parse(setupTime);
   
   if (setupTime !== null) {
       if(now - parsed.expiry > hours * 60 * 60 * 1000) {
           localStorage.removeItem('access_token');
           window.location.reload();
       }
   }
   


   useEffect(() => {

    const handleMessage = (event) => {
      // Ensuring the message
        const { type } = event.data;
        if (type === 'embedded_disconnect') {
          localStorage.removeItem('access_token');
           window.location.reload();
        }
    };
  
    // Adding event listener for messages
    window.addEventListener('message', handleMessage);
  
    // Cleaning up event listener on component unmount
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);


  return (
    <ThemeProvider>
      <ThemeColorPresets>
        <RtlLayout>
          <MotionLazyContainer>
            <ProgressBarStyle />
            <ScrollToTop />
            <WagmiConfig config={config}>
            <Router />
            </WagmiConfig>
          </MotionLazyContainer>
        </RtlLayout>
      </ThemeColorPresets>
    </ThemeProvider>
  );
}
