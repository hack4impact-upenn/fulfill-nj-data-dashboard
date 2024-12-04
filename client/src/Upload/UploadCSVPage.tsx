import React, { useState } from 'react';
import CSVReader from 'react-csv-reader';
import { postData } from '../util/api.tsx';

const CSVUploadPage = () => {
  const [error, setError] = useState('');

  const handleAgencyContactFileUpload = async (data: any) => {
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
    const chunkSize = 20; 
    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize);
      const res = await postData('agency/uploadfoodata', chunk);
      if (res.error) {
        throw Error(res.error.message);
      }
      break;
    }
  };

  return (
    <div style={{
      padding: '20px',
      maxWidth: '600px',
      margin: '0 auto',
      backgroundColor: '#f0f8ff', // Light blue background
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      textAlign: 'center'
    }}>
      <h2 style={{ color: '#004d40', fontFamily: 'Arial, sans-serif' }}>Upload CSV Files</h2>

      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ color: '#00796b', fontFamily: 'Arial, sans-serif' }}>Agency Contact File</h3>
        <CSVReader
          onFileLoaded={handleAgencyContactFileUpload}
          onError={(error) => console.error('Error reading file:', error)}
          parserOptions={{ header: true }}
          inputId="csvUpload1"
          inputStyle={{
            marginTop: '20px',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #00796b',
            backgroundColor: '#e8f5e9',
            color: '#004d40'
          }}
        />
      </div>

      <div>
        <h3 style={{ color: '#00796b', fontFamily: 'Arial, sans-serif' }}>Agency Food Data File</h3>
        <CSVReader
          onFileLoaded={handleAgencyPickUpFileUpload}
          onError={(error) => console.error('Error reading file:', error)}
          parserOptions={{ header: true }}
          inputId="csvUpload2"
          inputStyle={{
            marginTop: '20px',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #00796b',
            backgroundColor: '#e8f5e9',
            color: '#004d40'
          }}
        />
      </div>

      {error && (
        <div style={{
          marginTop: '20px',
          color: '#d32f2f',
          fontFamily: 'Arial, sans-serif'
        }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default CSVUploadPage;
