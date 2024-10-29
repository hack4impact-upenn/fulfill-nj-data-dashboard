import { IZipcode, Zipcode } from '../models/zipcode.model.ts';

/**
 * Get Zipcode object associated with zipcode number
 * @param zipcode - zipcode number
 * @returns The Zipcode object {@link Zipcode}
 */
const getZipcodeByZipcode = async (zipcode: string) => {
    const zipcodeObj = await Zipcode.findOne({ zipcode: zipcode }).exec();
    return zipcodeObj;
};

/**
 * Fetch Zipcode object associated with id
 * @param zipcode - zipcode number
 * @returns The Zipcode object {@link Zipcode}
 */
const getZipcodeById = async (id: string) => {
    const zipcodeObj = await Zipcode.findById(id).exec();
    return zipcodeObj;
};

/**
 * @returns All the {@link Zipcode}s in the database.
 */
const getAllZipcodesFromDB = async () => {
    const zipcodeList = await Zipcode.find({}).exec();
    return zipcodeList;
};
  
/**
 * Remove Zipcode object associated with zipcode number
 * @param zipcode - zipcode number
 * @returns The deleted Zipcode object {@link Zipcode}
 */
const removeZipcodeByZipcode = async (zipcode: string) => {
    const zipcodeObj = await Zipcode.findOneAndDelete({
        zipcode: zipcode,
    }).exec();
    return zipcodeObj;
};

export {
    getZipcodeByZipcode,
    getZipcodeById,
    getAllZipcodesFromDB,
    removeZipcodeByZipcode,
}