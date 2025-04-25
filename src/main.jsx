import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import 'bootstrap/dist/css/bootstrap.min.css';
import {LoginUserProvider} from "./provider/LoginUserProvider.jsx";

const queryClient = new QueryClient();
createRoot(document.getElementById('root')).render(
        <QueryClientProvider client={queryClient}>
            <LoginUserProvider>
                <App/>
            </LoginUserProvider>
        </QueryClientProvider>
)
