export interface Guarantor {
    clientId: number;
    name: string;
    paternalLn: string;
    maternalLn: string;
    age: number;
    address: string;
    colonia: string;
    city: string;
    phone: string;
    nameJob: string;
    addressJob: string;
    phoneJob: string;
    garantias: {
        garantiaUno: string;
        garantiaDos: string;
        garantiaTres: string;
    };
}
