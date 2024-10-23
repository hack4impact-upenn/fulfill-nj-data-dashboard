import { Agency, IAgency } from '../models/agency.model';

const getAllAgencies = async () => {
  const donors = await Agency.find().exec();
  return donors;
};

const createAgency = async (agency: IAgency) => {
    const newAgency = new Agency(agency);
    const result = await newAgency.save();
    return result;
  };
  
const uploadAgencyCSV = async () => {

}

export {
    getAllAgencies,
    createAgency,
    uploadAgencyCSV,
  };
  