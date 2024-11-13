import fs from 'fs';
import { Agency, IAgency } from '../models/agency.model.ts';
import { ValidationError } from 'mongoose'; 

const headerMapping = new Map<string, string>([
  ['No.', 'no'],
  ['Agency', 'agency'],
  ['Edited Agency', 'editedAgency'],
  ['Address', 'address'],
  ['Total', 'total'],
  ['City', 'city'],
  ['State', 'state'],
  ['ZIP Code', 'zipcode'],
  ['Permit Web Orders', 'permitWebOrders'],
  ['Location Code', 'locationCode'],
  ['Phone No.', 'phoneNumber'],
  ['Phone Ext. No.', 'phoneExtension'],
  ['Contact', 'contact'],
  ['Search Name', 'searchName'],
  ['E-Mail', 'email'],
  ['FBC County Code', 'countyCode'],
  ['UNC Activity Status', 'activityStatus'],
  ['Days and Hours of Operation', 'hoursOfOperation'],
]);

const getAllAgencies = async () => {
  const donors = await Agency.find().exec();
  return donors;
};

const createAgency = async (agency: IAgency) => {
  const newAgency = new Agency(agency);
  const result = await newAgency.save();
  return result;
};

const uploadAgencyJSON = async (jsonData: any) => {
  const agencyList: Partial<IAgency>[] = [];
  const failedEntries: any[] = []; // To keep track of entries that don't match the IAgency format

  for (const r in jsonData) {
    const row = jsonData[r];
    const agency: Partial<IAgency> = {};

    headerMapping.forEach((value: string, key: any) => {
      if (row[key] !== undefined) {
        agency[value as keyof IAgency] = row[key];
      }
    });

    agency["monthlyData"] = new Map(); 
    try {
      // check if existing agency if not:
      if (!Agency.findOne({ agency })) {
        const agencyDocument = new Agency(agency);
        agencyList.push(agency);
        await agencyDocument.save();
      }
      // update agency 
      else 
      {
        
      }
    } catch (error: any) {
      failedEntries.push({ entry: row, error: error.message });
    }
  }
  return {
    saved: agencyList.length,
    failed: failedEntries.length,
    failedEntries, // Optional: return failed entries for further inspection
  };
};


const uploadAgencyMonthlyData = async (jsonData:any) => {
  for (const r in jsonData) {
    const row = jsonData[r]
    const agencyName = row.Agency;
    const agency = await Agency.findOne({ "agency": agencyName }).exec();
    const monthlyDataMap = agency?.monthlyData || new Map();
    Object.entries(row).forEach(([key, value]) => {
      if (key !== 'Agency') {
        monthlyDataMap.set(key, value);
      }
    });
    await Agency.findOneAndUpdate(
      { "agency": agencyName },
      { $set: { "monthlyData" : monthlyDataMap }}
    ).exec();
  }
}

export { getAllAgencies, createAgency, uploadAgencyJSON, uploadAgencyMonthlyData };
