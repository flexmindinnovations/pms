import {StrictMode, Suspense} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {MantineProvider} from '@mantine/core'
import {Notifications} from '@mantine/notifications'
import {ModalsProvider} from '@mantine/modals'
import {ErrorBoundary} from '@components/ErrorBoundary'
import {BrowserRouter} from "react-router-dom";
import {AppLoader} from "@components/AppLoader.jsx";
import {ApiConfigProvider} from "@context/ApiConfig.jsx";
import {AuthProvider} from "@context/AuthContext.jsx";
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "./query-client.js";
import '@mantine/core/styles.css';
import 'mantine-datatable/styles.layer.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';
import {theme} from "./theme.js";


const AppWrapper = () => (
    <MantineProvider theme={theme}>
        <Notifications position='top-center' zIndex={9999}/>
        <ModalsProvider
            modalProps={{
                withCloseButton: false,
                radius: 'lg',
            }}
        >
            <QueryClientProvider client={queryClient}>
                <Suspense fallback={<AppLoader/>}>
                    <App/>
                </Suspense>
            </QueryClientProvider>
        </ModalsProvider>
    </MantineProvider>
)

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <ErrorBoundary>
                <ApiConfigProvider>
                    <AuthProvider>
                        <AppWrapper/>
                    </AuthProvider>
                </ApiConfigProvider>
            </ErrorBoundary>
        </BrowserRouter>
    </StrictMode>,
)
