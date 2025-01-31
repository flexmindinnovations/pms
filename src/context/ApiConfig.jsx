import {createContext, useContext} from "react";
const endpoint = `https://test.feerecovery.shashibgroup.in/aws/Api`;
const contextConfig = {
    login: `https://test.pms.shashibgroup.in/aws/api/Authentication`,
    students: {
        list: (pageNumber = 1, pageSize = 2) => `${endpoint}/Student/List?PageNumber=${pageNumber}&PageSize=${pageSize}`,
        getById: (id) => `${endpoint}/Student?Id=${id}`,
        create: `${endpoint}/Student`,
        update: `${endpoint}/Student`,
        delete: `${endpoint}/Student`,
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



