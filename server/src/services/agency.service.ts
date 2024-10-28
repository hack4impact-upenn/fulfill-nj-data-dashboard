import fs from 'fs';
import { parse } from 'csv-parse';
import { Agency, IAgency } from '../models/agency.model.ts';

const headerMapping = {
  'No.': 'no',
  Name: 'name',
  Address: 'address',
  City: 'city',
  State: 'state',
  'ZIP Code': 'zipcode',
  'Permit Web Orders': 'permitWebOrders',
  'Location Code': 'locationCode',
  'Phone No.': 'phoneNumber',
  'Phone Ext. No.': 'phoneExtension',
  Contact: 'contact',
  'Search Name': 'searchName',
  'E-Mail': 'email',
  'FBC County Code': 'countyCode',
  'UNC Activity Status': 'activityStatus',
  'Days and Hours of Operation': 'hoursOfOperation',
};

const getAllAgencies = async () => {
  const donors = await Agency.find().exec();
  return donors;
};

const createAgency = async (agency: IAgency) => {
  const newAgency = new Agency(agency);
  const result = await newAgency.save();
  return result;
};

const uploadAgencyCSV = async (filePath: string) => {
  const agencyList: Partial<IAgency>[] = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(parse({columns: true}))
      .on('data', (row: Record<string, string>) => {
        const agency: Partial<IAgency> = {};
        Object.entries(headerMapping).forEach(([csvHeader, schemaField]) => {
          if (csvHeader in row) {
            const value = row[csvHeader];
            switch (schemaField) {
              case 'zipcode':
                agency[schemaField] = parseInt(value, 10);
                break;
              case 'permitWebOrders':
                agency[schemaField] = value.toLowerCase() === 'true';
                break;
              default:
                agency[schemaField as keyof IAgency] = value;
            }
          }
        });
        agency.suppliers = new Map();
        agencyList.push(agency);
      })
      .on('end', async () => {
        try {
          const createdAgencies = await Agency.insertMany(agencyList);
          resolve(createdAgencies);
        } catch (error) {
          reject(error);
        }
      })
      .on('error', (error: unknown) => {
        reject(error);
      });
  });
};

export { getAllAgencies, createAgency, uploadAgencyCSV };
