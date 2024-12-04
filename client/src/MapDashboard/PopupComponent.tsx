/* eslint-disable */
import React from 'react';

interface PopupProps {
  popupData: {
    geography?: string;
    tot_pop?: number;
    median_income?: number;
    pct_poverty?: number;
    unemployment_rate?: number;
    pct_food_insecure?: number;
    pct_black?: number;
    pct_hispanic?: number;
    pct_homeowners?: number;
    pct_disability?: number;
  } | null;
  setPopupCoords: (coords: [number, number] | null) => void;
}

const PopupComponent: React.FC<PopupProps> = ({ popupData, setPopupCoords }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: `5px`,
        top: `5px`,
        backgroundColor: 'white',
        border: '1px solid black',
        borderRadius: '5px',
        padding: '10px',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)',
        zIndex: 1000,
      }}
    >
      <h4>ZIP Code: {popupData?.geography || 'N/A'}</h4>
      <p>Total Population: {popupData?.tot_pop ? popupData.tot_pop.toLocaleString() : 'N/A'}</p>
      <p>Median Income: {popupData?.median_income ? `$${popupData.median_income.toLocaleString()}` : 'N/A'}</p>
      <p>Poverty Rate: {popupData?.pct_poverty ? `${(popupData.pct_poverty * 100).toFixed(1)}%` : 'N/A'}</p>
      <p>Unemployment Rate: {popupData?.unemployment_rate ? `${(popupData.unemployment_rate * 100).toFixed(1)}%` : 'N/A'}</p>
      <p>Food Insecurity: {popupData?.pct_food_insecure ? `${(popupData.pct_food_insecure * 100).toFixed(1)}%` : 'N/A'}</p>
      <p>Black Population: {popupData?.pct_black ? `${(popupData.pct_black * 100).toFixed(1)}%` : 'N/A'}</p>
      <p>Hispanic Population: {popupData?.pct_hispanic ? `${(popupData.pct_hispanic * 100).toFixed(1)}%` : 'N/A'}</p>
      <p>Homeownership: {popupData?.pct_homeowners ? `${(popupData.pct_homeowners * 100).toFixed(1)}%` : 'N/A'}</p>
      <p>Disability Rate: {popupData?.pct_disability ? `${(popupData.pct_disability * 100).toFixed(1)}%` : 'N/A'}</p>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '10px',
        }}
      >
        <button
          onClick={() => setPopupCoords(null)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007BFF',
            color: '#FFF',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'background-color 0.3s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#007BFF')}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PopupComponent;
