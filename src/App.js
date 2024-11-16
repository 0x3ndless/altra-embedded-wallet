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
import { WagmiProvider, createConfig, http } from 'wagmi';
import { polygonAmoy } from "wagmi/chains"; 
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { metaMask } from 'wagmi/connectors'
import { useEffect } from 'react';
// ----------------------------------------------------------------------


// Set up wagmi config
const config = createConfig({
  autoConnect: true,
  chains: [polygonAmoy],
  multiInjectedProviderDiscovery: false,
  connectors: [
    metaMask(),
  ],
  transports: {
    [polygonAmoy.id]: http(
      `${process.env.REACT_APP_AMOY_RPC_URL}`,
    ),
  },  
});

const queryClient = new QueryClient();


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
            <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
            <Router />
            </QueryClientProvider>
            </WagmiProvider>
          </MotionLazyContainer>
        </RtlLayout>
      </ThemeColorPresets>
    </ThemeProvider>
  );
}
