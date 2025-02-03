import {createContext, useContext} from "react";
import {utils} from "../utils.js";

const endpoint = `https://test.feerecovery.shashibgroup.in/aws/Api`;
const contextConfig = {
    login: `https://test.pms.shashibgroup.in/aws/api/Authentication`,
    students: {
        list: (pageNumber = 1, pageSize = 2) => `${endpoint}/Student/List?PageNumber=${pageNumber}&PageSize=${pageSize}`,
        getById: (id) => `${endpoint}/Student?Id=${id}`,
        create: `${endpoint}/Student`,
        update: `${endpoint}/Student`,
        delete: `${endpoint}/Student`,
    },
    recoveryAgent: {
        list: (pageNumber = 1, pageSize = 1) => `${endpoint}/RecoveryAgent/List?PageNumber=${pageNumber}&PageSize=${pageSize}`,
        getById: (id) => `${endpoint}/RecoveryAgent?Id=${id}`,
        create: `${endpoint}/RecoveryAgent`,
        update: `${endpoint}/RecoveryAgent`,
        delete: `${endpoint}/RecoveryAgent`,
    },
    recoveryCampaign: {
        list: (pageNumber = utils.pageConfig.pageNumber, pageSize = utils.pageConfig.pageSize) => `${endpoint}/RecoveryCampaign/List?PageNumber=${pageNumber}&PageSize=${pageSize}`,
        getById: (id) => `${endpoint}/RecoveryCampaign?Id=${id}`,
        details: (id, pageNumber = utils.pageConfig.pageNumber, pageSize = utils.pageConfig.pageSize) => `${endpoint}/CampaignDetail/List?RecoveryCampaignId=${id}&PageNumber=${pageNumber}&PageSize=${pageSize}`,
        activate: `${endpoint}/RecoveryCampaign/Activate`,
        create: `${endpoint}/RecoveryCampaign`,
        update: `${endpoint}/RecoveryCampaign`,
        delete: `${endpoint}/RecoveryCampaign`,
        tallySync: `${endpoint}/RecoveryCampaign/TallySync`,
    },
    followUp: {
        list: (pageNumber = 1, pageSize = 1) => `${endpoint}/FollowUp/List?PageNumber=${pageNumber}&PageSize=${pageSize}`,
        getById: (id) => `${endpoint}/FollowUp?Id=${id}`,
        create: `${endpoint}/FollowUp`,
        update: `${endpoint}/FollowUp`,
        delete: `${endpoint}/FollowUp`,
    }
}

const ApiConfigContext = createContext(contextConfig);

export function ApiConfigProvider({children}) {

    return <ApiConfigContext.Provider value={{
        ...contextConfig,
    }}>
        {children}
    </ApiConfigContext.Provider>;
}

export const useApiConfig = () => {
    const context = useContext(ApiConfigContext)
    if (!context) {
        throw new Error('useApiConfig must be used within an ApiConfigProvider')
    }
    return context
}



