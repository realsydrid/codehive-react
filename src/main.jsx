import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import 'bootstrap/dist/css/bootstrap.min.css';
import {LoginUserProvider} from "./provider/LoginUserProvider.jsx";
import {GoogleOAuthProvider} from "@react-oauth/google";

const queryClient = new QueryClient();
createRoot(document.getElementById('root')).render(
        <QueryClientProvider client={queryClient}>
            <GoogleOAuthProvider clientId={"603318634364-ptp2b6frq5n41dj2hujlkn7esi8hk5l2.apps.googleusercontent.com"}>
                <LoginUserProvider>
                    <App/>
                </LoginUserProvider>
            </GoogleOAuthProvider>
        </QueryClientProvider>
)
