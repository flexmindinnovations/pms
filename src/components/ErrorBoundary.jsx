import { useState, useEffect } from "react";
import { Container } from "@mantine/core";
export function ErrorBoundary({ children }) {
    const [error, setError] = useState();


    const showError = (error, errorStack) => {
        console.log('Error caught by error boundary: ', error, errorStack);
        setError(error);
    }

    const errorHandler = (event) => {
        const error = new Error(event.error.message)
        const errorStack = { componentStack: event.error.stack }
        showError(error, errorStack)
    }

    useEffect(() => {
        window.addEventListener('error', errorHandler)

        return () => {
            window.removeEventListener('error', errorHandler)
        }
    }, []);

    if (error) return <Container m={0} p={0} fluid className="h-full w-full flex items-center justify-center">
        <h1>Something went wrong...</h1>
    </Container>

    return children;
}