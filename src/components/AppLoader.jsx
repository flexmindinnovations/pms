import {Container, Loader} from "@mantine/core";

export function AppLoader() {
    return (
        <Container className={`w-full h-full flex items-center justify-center`} fluid m={0} p={0}>
            <Loader/>
        </Container>
    )
}