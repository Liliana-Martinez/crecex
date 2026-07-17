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
    jobName: string;
    workAddress: string;
    workPhone: string;
    referenceName: string;
    referenceAddress: string;
    referencePhone: string;
    collateral: {
        firstCollateral: string;
        secondCollateral: string;
        thirdCollateral: string;
    };
}

//type ModifiedClientData = Partial<Client>;
