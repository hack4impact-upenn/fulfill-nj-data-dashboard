import fs from 'fs';
import { Agency, IAgency } from '../models/agency.model.ts';
// import { ValidationError } from 'mongoose'; 

const headerMapping = new Map<string, string>([
  ['No.', 'no'],
  ['Agency', 'name'],
  ['Edited Agency', 'editedName'],
  ['Address', 'address'],
  ['Total', 'total'],
  ['City', 'city'],
  ['State', 'state'],
  ['ZIP Code', 'zipcode'],
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
  const failedEntries: any[] = [];

  for (let i = 0; i < jsonData.length; i++) {
    let row = jsonData[i];
    const agency: Partial<IAgency> = {};

    if (row["Agency"] != "Total"){
      headerMapping.forEach((value: string, key: string) => {
        if (row[key] !== undefined) {
          let fieldValue = row[key];
          agency[value as keyof IAgency] = fieldValue;
        }
      });
      
      agency["monthlyData"] = new Map(); 
    
      console.log(row["Agency"]);
      console.log(agency);
    
      try {
        await Agency.findOneAndUpdate( {name: agency["name"]}, agency, { upsert: true } );
      } catch (error: any) {
        console.log(error);
        failedEntries.push({ entry: row, error: error.message });
      }
    }
  }

  return {
    numFailed: failedEntries.length,
    failedEntries: failedEntries,
  };
};


const uploadAgencyMonthlyData = async (jsonData:any) => {
  for (const r in jsonData) {
    const row = jsonData[r];
    try {
      const agency = await Agency.findOne({ name: row["Edited Agency Name"] });
      if (!agency) {
        console.log(row);
        console.log('Agency not found');
        return;
      }
      const monthlyDataMap = agency.monthlyData;
      for (const [month, value] of Object.entries(row)) {
        if (monthlyDataMap.has(month)) {
          console.log(`${month} already exists. Updating the value.`);
        } else {
          console.log(`${month} doesn't exist. Adding new value.`);
        }
        // Add or update the data in the Map
        const val = String(value).replace(/,/g, ""); 
        monthlyDataMap.set(month, Number(val));
      }
      await Agency.findOneAndUpdate( {name: agency["name"]}, agency, { upsert: true } );
    } catch (error: any) {
      // failedEntries.push({ entry: row, error: error.message });
    }
  }
}

export { getAllAgencies, createAgency, uploadAgencyJSON, uploadAgencyMonthlyData };
