import React, { useState } from 'react';
import CSVReader from 'react-csv-reader';
import { postData } from '../util/api.tsx';

const CSVUploadPage = () => {
  const [csvData, setCsvData] = useState([]);
  const [error, setError] = useState('');

  const handleFileUpload = (data: any) => {
    setCsvData(data);
    postData('agency/uploadagencycontact', data).then((res) => {
        if (res.error) {
          setError(res.error.message);
        }
      });

  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Upload Agency Contact CSV File</h2>
      <CSVReader
        onFileLoaded={handleFileUpload}
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
