import {createContext, useContext} from "react";
import {utils} from "../utils.js";

const endpoint = `https://test.feerecovery.shashibgroup.in/aws/Api`;
const defaultPageNumber = typeof utils.pageConfig.pageNumber === 'object' ? 1 : utils.pageConfig.pageNumber;
const defaultPageSize = typeof utils.pageConfig.pageSize === 'object' ? 15 : utils.pageConfig.pageSize;
const contextConfig = {
    login: `https://test.pms.shashibgroup.in/aws/api/Authentication`,
    students: {
        list: (pageNumber = defaultPageNumber, pageSize = defaultPageSize) => `${endpoint}/Student/List?PageNumber=${pageNumber}&PageSize=${pageSize}`,
        getById: (id) => `${endpoint}/Student?Id=${id}`,
        create: `${endpoint}/Student`,
        update: `${endpoint}/Student`,
        delete: `${endpoint}/Student`,
    },
    recoveryAgent: {
        list: (pageNumber = defaultPageNumber, pageSize = defaultPageSize) => `${endpoint}/RecoveryAgent/List?PageNumber=${pageNumber}&PageSize=${pageSize}`,
        getById: (id) => `${endpoint}/RecoveryAgent?Id=${id}`,
        create: `${endpoint}/RecoveryAgent`,
        update: `${endpoint}/RecoveryAgent`,
        delete: `${endpoint}/RecoveryAgent`,
    },
    recoveryCampaign: {
        list: (pageNumber = defaultPageNumber, pageSize = defaultPageSize) => `${endpoint}/RecoveryCampaign/List?PageNumber=${pageNumber}&PageSize=${pageSize}`,
        getById: (id) => `${endpoint}/RecoveryCampaign?Id=${id}`,
        details: (id, pageNumber = defaultPageNumber, pageSize = defaultPageSize) => `${endpoint}/CampaignDetail/List?RecoveryCampaignId=${id}&PageNumber=${pageNumber}&PageSize=${pageSize}`,
        activate: `${endpoint}/RecoveryCampaign/Activate`,
        create: `${endpoint}/RecoveryCampaign`,
        update: `${endpoint}/RecoveryCampaign`,
        delete: `${endpoint}/RecoveryCampaign`,
        tallySync: `${endpoint}/RecoveryCampaign/TallySync`,
    },
    followUp: {
        list: (CampaignDetailsId, pageNumber = defaultPageNumber, pageSize = defaultPageSize) => `${endpoint}/Followup/List?CampaignDetailsId=${CampaignDetailsId}&PageNumber=${pageNumber}&PageSize=${pageSize}`,
        getById: (id) => `${endpoint}/Followup?Id=${id}`,
        create: `${endpoint}/Followup`,
        update: `${endpoint}/Followup`,
        delete: `${endpoint}/Followup`,
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



