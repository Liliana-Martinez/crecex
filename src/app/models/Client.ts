export interface Client {
    name: string;
    paternalLn: string;
    maternalLn: string;
    age: number;
    address: string;
    colonia: string;
    city: string;
    phone: string;
    classification: string;
    zone: number;
    nameJob: string;
    addressJob: string;
    phoneJob: string;
    nameReference: string;
    addressReference: string;
    phoneReference: string;
    garantias: {
        garantiaUno: string;
        garantiaDos: string;
        garantiaTres: string;
    };
}
type ModifiedClientData = Partial<Client>;
