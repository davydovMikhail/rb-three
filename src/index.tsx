import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './store';
import { Config, Sepolia, DAppProvider } from "@usedapp/core";
import { config } from './config';

const DAppConfig: Config = {
  readOnlyChainId: Sepolia.chainId,
  readOnlyUrls: {
    [Sepolia.chainId]: config.network.sepolia.url
  },
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <DAppProvider config={DAppConfig}>
      <Provider store={store}>
        <App />
      </Provider>
    </DAppProvider>
);
