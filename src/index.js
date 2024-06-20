import { createRoot } from 'react-dom/client';
import App from './App';
// import Test from "./Test";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import MyProvider from './MyProvider';
import { Provider } from 'react-redux';
import store from './r-store/store';

const queryClient = new QueryClient();

createRoot(document.querySelector('#root')).render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <MyProvider>
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
      </MyProvider>
    </QueryClientProvider>
  </Provider>
);
