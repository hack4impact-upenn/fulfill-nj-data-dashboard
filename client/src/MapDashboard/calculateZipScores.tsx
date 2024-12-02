/* eslint-disable */
import React, { useState } from 'react';

interface ServerZipData {
  geography: string;
  tot_pop: number;
  pct_food_insecure: number;
  number_food_insecure: number;
  unemployment_rate: number;
  pct_poverty: number;
  pct_black: number;
  pct_hispanic: number;
  median_income: number;
  pct_homeowners: number;
  pct_disability: number;
}

/**
 * Normalize a value to a range between 0 and 1.
 * @param value - The value to normalize.
 * @param min - The minimum value in the range.
 * @param max - The maximum value in the range.
 * @returns The normalized value.
 */
function normalize(value: number, min: number, max: number): number {
  if (max === min) {
    return 0.5; // Avoid division by zero
  }
  return (value - min) / (max - min);
}

/**
 * Preprocess the data by normalizing all variables at the start.
 * @param zipData - Array of ZIP code data.
 * @returns A map of normalized data for each variable.
 */
function preprocessData(zipData: ServerZipData[]): { [key: string]: { [key: string]: number } } {
  const normalizedData: { [key: string]: { [key: string]: number } } = {};

  Object.keys(zipData[0] || {}).forEach((key) => {
    if (key !== "geography") {
      const values = zipData.map((zip) => (zip as any)[key]);
      const minVal = Math.min(...values);
      const maxVal = Math.max(...values);

      normalizedData[key] = zipData.reduce((acc, zip) => {
        acc[zip.geography] = normalize((zip as any)[key], minVal, maxVal);
        return acc;
      }, {} as { [key: string]: number });
    }
  });

  return normalizedData;
}

/**
 * Calculate scores for ZIP codes based on selected variables.
 * @param zipData - Array of ZIP code data.
 * @param variables - Object indicating which variables to include in the score.
 * @returns A map of ZIP code to calculated score.
 */
export function calculateZipScores(
  zipData: ServerZipData[],
  variables: { [key: string]: boolean }
): Map<string, number> {
  const scores = new Map<string, number>();

  // Preprocess data to normalize all variables
  const normalizedData = preprocessData(zipData);

  // Calculate composite scores
  zipData.forEach((zip) => {
    const activeVariables = Object.keys(variables).filter((key) => variables[key]);

    if (activeVariables.length === 0) {
      scores.set(zip.geography, 0.5); // Failsafe: default to 0.5 when no variables are selected
    } else {
      let totalScore = 0;

      activeVariables.forEach((key) => {
        totalScore += normalizedData[key][zip.geography];
      });

      const averageScore = totalScore / activeVariables.length;
      scores.set(zip.geography, normalize(averageScore, 0, 1)); // Rescale the score
    }
  });

  return scores;
}

// Map variable keys to human-readable names
const variableNames: { [key: string]: string } = {
  tot_pop: 'Total Population',
  pct_food_insecure: 'Food Insecurity %',
  number_food_insecure: 'Number Food Insecure',
  unemployment_rate: 'Unemployment Rate %',
  pct_poverty: 'Poverty %',
  pct_black: 'Black Population %',
  pct_hispanic: 'Hispanic Population %',
  median_income: 'Median Income',
  pct_homeowners: 'Homeowners %',
  pct_disability: 'Disability %',
};

// Dashboard Component for Toggling Variables
export function ScoreDashboard({
  variables,
  setVariables,
}: {
  variables: { [key: string]: boolean };
  setVariables: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
}) {
  const containerStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '0.5rem',
    position: 'fixed',
    bottom: '1rem',
    left: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '0.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    fontSize: '0.8rem', // Smaller font size
  };

  const labelStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
  };

  return (
    <div style={containerStyle}>
      {Object.keys(variables).map((key) => (
        <label key={key} style={labelStyle}>
          <input
            type="checkbox"
            checked={variables[key]}
            onChange={() =>
              setVariables((prev) => ({
                ...prev,
                [key]: !prev[key],
              }))
            }
          />
          {variableNames[key] || key}
        </label>
      ))}
    </div>
  );
}