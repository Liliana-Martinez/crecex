export const API_URL = 'http://localhost:3000/api';

export const API_ROUTES = {
    AUTH: {
        LOGIN: `${API_URL}/auth/login`,
        REGISTER: `${API_URL}/auth/register`
    },
    CLIENTS_GUARANTORS: {
        CREATE: {
           CLIENT: `${API_URL}/clients-guarantors/add/client`, //post
           GUARANTOR: `${API_URL}/clients-guarantors/add/guarantor` //post
        },
        GET_BY_NAME: `${API_URL}/clients-guarantors/consult`, //get
        UPDATE: {
            CLIENT: `${API_URL}/clients-guarantors/modify/client`, //put
            GUARANTOR: `${API_URL}/clients-guarantors/modify/guarantor`//put
        }
    }, 
    CREDITS:  {
        CREATE_NEW: `${API_URL}/credits/new`,
        RENEW: `${API_URL}/credits/renew`,
        CREATE_ADDITIONAL: `${API_URL}/credits/additional`
    },
    PAYMENTS: {
        GET_BY_ZONE: `${API_URL}/payments`
    },
    COLLECTORS: {
        GET_BY_NAME: `${API_URL}/collectors` //No genero error
    },
    COMMISSIONS: {
        GET_BY_ZONE: `${API_URL}/commissions`
    },
    STATISTICS: {
        CASH: { //Submodulo
            CREATE_ENTRY: `${API_URL}/statistics/cash`, //crear movimiento en caja ingreso/egreso
            GET_REPORT: `${API_URL}/statistics/cash`
        },
        TOTAL_CREDITS: { //Submodulo
            DAY: `${API_URL}/statistics/total-credits/day`, 
            WEEK: `${API_URL}/statistics/total-credits/week`,
            MONTH: `${API_URL}/statistics/total-credits/month`
        },
        TOTAL_PAYMENTS: `${API_URL}/statistics/total-payments` //Submodulo
    },
    CREDIT_BUREAU: {
        CREATE: `${API_URL}/credit-bureau/add`, //Registar cliente en buro de credito
        GET_BY_NAME: `${API_URL}/credit-bureau/consult`
    },
    ZONES: {
        GET_ALL: `${API_URL}/zones/getAllZones`,
        GET_AVAILABLE: `${API_URL}/zones/getAvailableZones`,
        GET_ASSIGNED: `${API_URL}/zones/getAssignedZones`,
        GET_CLIENTS_BY_ZONE: `${API_URL}/zones/getClientsFromZone`,
        CREATE:  `${API_URL}/zones`,
        UPDATE: `${API_URL}/zones/modify`,
        CONSULT: `${API_URL}/zones/consult` //Ver donde se usa
    },
    SEARCHBARCLIENTE:{
        SEARCH : `${API_URL}/search/cliente` //Agregar dentro de cliente como SEARCH
    }
};