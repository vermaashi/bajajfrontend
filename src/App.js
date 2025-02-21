import React, { useState } from "react";
import axios from "axios";
import "./App.css";


const App = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([]);

  const backendUrl = "http://localhost:5000/bfhl"; // Ensure correct backend URL

  const handleSubmit = async () => {
    setError("");
    try {
      const parsedData = JSON.parse(jsonInput);
      if (!parsedData.data || !Array.isArray(parsedData.data)) {
        throw new Error("Invalid JSON format. Expected an array in 'data'.");
      }

      const response = await axios.post(backendUrl, parsedData);
      setResponseData(response.data);
    } catch (err) {
      setError("Invalid JSON format or server error.");
      console.error(err);
    }
  };

  const handleFilterChange = (event) => {
    const value = event.target.value;
    setSelectedFilters((prevFilters) =>
      prevFilters.includes(value)
        ? prevFilters.filter((item) => item !== value)
        : [...prevFilters, value]
    );
  };

  const getFilteredResponse = () => {
    if (!responseData) return null;
    const { numbers, alphabets, highest_alphabet } = responseData;
    const filteredData = {};
    if (selectedFilters.includes("Numbers")) filteredData.numbers = numbers;
    if (selectedFilters.includes("Alphabets")) filteredData.alphabets = alphabets;
    if (selectedFilters.includes("Highest Alphabet")) filteredData.highest_alphabet = highest_alphabet;
    return filteredData;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">BFHL JSON Processor</h1>
      
      <textarea
        className="border border-gray-400 p-2 w-full max-w-lg h-24"
        placeholder='Enter JSON (e.g. { "data": ["A", "B", "5"] })'
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
      />
      
      <button
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={handleSubmit}
      >
        Submit
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {responseData && (
        <div className="mt-4 w-full max-w-lg">
          <h2 className="text-lg font-semibold">Select Filters:</h2>
          
          <div className="flex gap-2 mt-2">
            {["Numbers", "Alphabets", "Highest Alphabet"].map((option) => (
              <label key={option} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={option}
                  checked={selectedFilters.includes(option)}
                  onChange={handleFilterChange}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>

          <div className="mt-4 p-4 border bg-white rounded">
            <h3 className="font-semibold">Filtered Response:</h3>
            <pre className="bg-gray-200 p-2">{JSON.stringify(getFilteredResponse(), null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
