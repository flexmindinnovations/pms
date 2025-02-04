import {Button, Container, Grid, Group, NumberInput, Textarea, TextInput, useMantineTheme} from "@mantine/core";
import {useEffect, useState} from "react";
import {useHttp} from "@hooks/AxiosInstance.js";
import {useModal} from "@hooks/AddEditModal.jsx";
import {useApiConfig} from "@context/ApiConfig.jsx";
import {useForm} from "@mantine/form";
import {DateInput} from "@mantine/dates";
import {utils} from "../utils.js";
import dayjs from "dayjs";

const dummyData = {
    recoveryAgentEmail: "agent@example.com",
    committmentAmount: 2000,
    committmentDate: "2025-03-10T09:00:00Z",
    remarks: "Customer agreed to pay next week."
};

export function CreateUpdateFollowUp({
                                         data = {}, mode = 'add', handleCancel
                                     }) {
    const [disableForm, setDisableForm] = useState(false);
    const {campaignId, ...rest} = data;
    const formData = Object.keys(rest).length ? rest : dummyData;
    const form = useForm({
        initialValues: {
            recoveryAgentEmail: formData.recoveryAgentEmail || "",
            committmentAmount: formData.committmentAmount || "",
            committmentDate: formData.committmentDate ? dayjs(formData.committmentDate).toDate() : null,
            remarks: formData.remarks || "",
        },
        enhanceGetInputProps: () => ({disabled: disableForm}),
        validate: {
            recoveryAgentEmail: (value) =>
                /^\S+@\S+\.\S+$/.test(value) ? null : "Invalid email format",
            committmentAmount: (value) =>
                value > 0 ? null : "Commitment Amount must be greater than 0",
            committmentDate: (value) => (value ? null : "Commitment Date is required"),
        },
    });
    const [isLoading, setIsLoading] = useState(false);
    const theme = useMantineTheme();
    const {post, put} = useHttp();
    const apiConfig = useApiConfig();

    const handleLinkClick = (record) => {
        console.log('record: ', record);
    }

    const handleSubmit = async (values) => {
        setIsLoading(true);
        setDisableForm(true);
        try {
            const formValues = {campaignDetailsId: campaignId, ...values}
            console.log('formValues: ', formValues);
            const response = mode === 'add' ? await post(apiConfig.followUp.create, formValues) : await put(apiConfig.followUp.update, {id: campaignId, ...values});
            if (response.status === 200) {
                utils.showNotifications('Success', 'Operation successful!', 'success', theme);
            }
        } catch (error) {
            console.log(error);
            utils.showNotifications('Error', error.message, 'error', theme);
        } finally {
            setIsLoading(false);
            setDisableForm(false);
            handleCancel({refresh: true});
        }
    }

    return (
        <Container size={'xl'} p={20}>

            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Grid gutter="md">
                    <Grid.Col span={{base: 12, sm: 6}}>
                        <TextInput
                            label="Recovery Agent Email"
                            placeholder="Enter Email"
                            {...form.getInputProps("recoveryAgentEmail")}
                        />
                    </Grid.Col>

                    <Grid.Col span={{base: 12, sm: 6}}>
                        <NumberInput
                            label="Commitment Amount"
                            placeholder="Enter Amount"
                            min={1}
                            {...form.getInputProps("committmentAmount")}
                        />
                    </Grid.Col>

                    <Grid.Col span={{base: 12, sm: 6}}>
                        <DateInput
                            label="Commitment Date"
                            placeholder="Select Date"
                            {...form.getInputProps("committmentDate")}
                        />
                    </Grid.Col>

                    <Grid.Col span={12}>
                        <Textarea
                            label="Remarks"
                            placeholder="Enter Remarks"
                            {...form.getInputProps("remarks")}
                        />
                    </Grid.Col>
                </Grid>
                <Group position="center" justify={'end'} style={{marginTop: '1rem'}}>
                    <Button
                        onClick={handleCancel}
                        variant="outline"
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading} loading={isLoading}>
                        Submit
                    </Button>
                </Group>
            </form>
        </Container>
    )
}