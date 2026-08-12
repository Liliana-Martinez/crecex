export interface Guarantor {
    personalData: {
        clientId: number;
        name: string;
        paternalLn: string;
        maternalLn: string;
        age: number;
        address: string;
        colonia: string;
        city: string;
        phone: string;
        jobName: string;
        workAddress: string;
        workPhone: string;
    };
    collateral: {
        firstCollateral: string;
        secondCollateral: string;
        thirdCollateral: string;
    };
}
