import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NormalizationService {

  constructor() { }

  private normalizeText(value: string): string { 
    return (value ?? '').trim().replace(/\s+/g, ' '); 
  }

  formatTitleCase(value: string): string { 
    return this.normalizeText(value).toLowerCase().replace(/\b\w/g, letter => letter.toUpperCase()); 
  }

  normalizePhone(phone: string): string {
    return (phone ?? '').replace(/\D/g,'');
  }

  normalizeClassification(value: string): string {
    return this.normalizeText(value).toUpperCase();
  }

  normalizePersonalData(personalData: any) {
    return {
      ...personalData,
      name: this.formatTitleCase(personalData.name),
      paternalLn: this.formatTitleCase(personalData.paternalLn),
      maternalLn: this.formatTitleCase(personalData.maternalLn),
      address: this.formatTitleCase(personalData.address),
      colonia: this.formatTitleCase(personalData.colonia),
      city: this.formatTitleCase(personalData.city),
      phone: this.normalizePhone(personalData.phone),
      classification: this.normalizeClassification(personalData.classification),
      jobName: this.formatTitleCase(personalData.jobName),
      workAddress: this.formatTitleCase(personalData.workAddress),
      workPhone: this.normalizePhone(personalData.workPhone),
      referenceName: this.formatTitleCase(personalData.referenceName),
      referenceAddress: this.formatTitleCase(personalData.referenceAddress),
      referencePhone: this.normalizePhone(personalData.referencePhone)
    };
  }

  normalizeCollateral(collateral: any) {
    return {
      firstCollateral: this.formatTitleCase(collateral.firstCollateral),
      secondCollateral: this.formatTitleCase(collateral.secondCollateral),
      thirdCollateral: this.formatTitleCase(collateral.thirdCollateral)
    };
  }
}
