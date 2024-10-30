import fs from 'fs';
import { Agency, IAgency } from '../models/agency.model.ts';

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
  // let monthsRE = new RegExp("^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/g");

  for (const r in jsonData) { // row = agency
    const row = jsonData[r]
    const agency: Partial<IAgency> = {};
    headerMapping.forEach((value: string, key: any) => {
      if (row[key] !== undefined) { // if jsonData has a key from headerMapping
        agency[value as keyof IAgency] = row[key];
      }
    });
    agency["monthlyData"] = new Map();
    agencyList.push(agency);
  }
  return agencyList;
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
