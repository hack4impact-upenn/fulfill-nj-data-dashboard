import React, { useState } from 'react';
import CSVReader from 'react-csv-reader';
import { postData } from '../util/api.tsx';

const CSVUploadPage = () => {
  // const [csvData, setCsvData] = useState([]);
  const [error, setError] = useState('');

  const handleAgencyContactFileUpload = async (data: any) => {
    // setCsvData(data);
    const chunkSize = 50; 
    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize);
      const res = await postData('agency/uploadagencycontact', chunk);
      if (res.error) {
        throw Error(res.error.message);
      }
      break;
    }
  };

  const handleAgencyPickUpFileUpload = async (data: any) => {
    // setCsvData(data);
    const chunkSize = 20; 
    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize);
      const res = await postData('agency/uploadagencypickup', chunk);
      if (res.error) {
        throw Error(res.error.message);
      }
      break;
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Upload Agency Contact CSV File</h2>
      <CSVReader
        onFileLoaded={handleAgencyContactFileUpload}
        onError={(error) => console.error('Error reading file:', error)}
        parserOptions={{ header: true }}
        inputId="csvUpload"
        inputStyle={{
          marginTop: '20px',
          padding: '10px',
          borderRadius: '5px',
          border: '1px solid #ccc'
        }}
      />

      <h2>Upload Agency Pickups CSV File</h2>
      <CSVReader
        onFileLoaded={handleAgencyPickUpFileUpload}
        onError={(error) => console.error('Error reading file:', error)}
        parserOptions={{ header: true }}
        inputId="csvUpload"
        inputStyle={{
          marginTop: '20px',
          padding: '10px',
          borderRadius: '5px',
          border: '1px solid #ccc'
        }}
      />
    </div>
  );
};

export default CSVUploadPage;
