export const API_URL = 'http://localhost:3000/api';

export const API_ROUTES = {
    AUTH: {
        LOGIN: `${API_URL}/auth/login`,
        REGISTER: `${API_URL}/auth/register`
    },
    HOME: `${API_URL}/home`,
    //CLIGRS = CLIENTESGUARANTORS
    CLIGRS: {
        ADD: `${API_URL}/clients-guarantors/add`,
        CONSULT: `${API_URL}/clients-guarantors/consult`,
        MODIFY: `${API_URL}/clients-guarantors/modify`
    },
    CREDITS: {
        NEW: `${API_URL}/credits/new`,
        RENEW: `${API_URL}/credits/renew`,
        ADDITIONAL: `${API_URL}/credits/additional`
    },
    PAYMENTS: `${API_URL}/payments`,
    COLLECTORS: `${API_URL}/collectors`,
    COMMISSIONS: `${API_URL}/commissions`,
    STATISTICS: {
        CASH: `${API_URL}/statistics/cash`,
        //TOTCRED = TOTALCREDITS
        TOTCRED: `${API_URL}/statistics/total-credits`,
        //TOTPAYM = TOTALPAYMENTS
        TOTPAYM: `${API_URL}/statistics/total-payments`
    },
    BUREAU: `${API_URL}/credit-bureau`,
    ZONES: {
        GETALL: `${API_URL}/zones/getAllZones`
    }
};