import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const SoilDataComponent = () => {
  const [soilData, setSoilData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedLayer, setExpandedLayer] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchSoilData = async () => {
      try {
        if ("geolocation" in navigator) {
          console.log('Requesting geolocation...');
          navigator.geolocation.getCurrentPosition(async function(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            console.log(`Latitude: ${lat}, Longitude: ${lon}`);
            
            const url = `https://rest.isric.org/soilgrids/v2.0/properties/query?lon=${lon}&lat=${lat}&property=bdod&property=cec&property=cfvo&property=clay&property=nitrogen&property=ocd&property=ocs&property=phh2o&property=sand&property=silt&property=soc&property=wv0010&property=wv0033&property=wv1500&depth=0-5cm&depth=0-30cm&depth=5-15cm&depth=15-30cm&depth=30-60cm&depth=60-100cm&depth=100-200cm&value=Q0.05&value=Q0.5&value=Q0.95&value=mean&value=uncertainty`;
            console.log('Fetching from URL:', url);


            setLoading(true);
            const response = await fetch(url, {
              headers: {
                accept: 'application/json',
              },
            });

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Received data:', data);
            setSoilData(data);
            setLoading(false);
          }, function(error) {
            console.error('Geolocation error:', error);
            setError('Error getting location: ' + error.message);
            setLoading(false);
          });
        } else {
          setError('Geolocation is not supported by this browser.');
          setLoading(false);
        }
      } catch (error) {
        console.error('Fetch error:', error);
        setError('Error fetching data: ' + error.message);
      }
    };

    fetchSoilData();
  }, []);

  if (loading) return <div className="text-center text-lg">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  const toggleLayer = (layerName) => {
    setExpandedLayer(expandedLayer === layerName ? null : layerName);
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6 text-green-700">Soil Data Analysis</h1>
      
      <div className="mb-4 p-4 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-bold mb-2 text-gray-800">Soil Properties Explained</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li><strong>BDOD (Bulk Density of Oven-Dry soil)</strong>: Measures the mass of dry soil per unit volume, indicating soil compaction. High bulk density suggests compacted soil, which affects water infiltration and root growth.</li>
          <li><strong>CEC (Cation Exchange Capacity)</strong>: Indicates soil's ability to hold and exchange cations (positively charged ions), crucial for nutrient availability. Higher CEC values mean better nutrient retention.</li>
          <li><strong>CFVO (Coarse Fragments Volume)</strong>: Refers to the volume of coarse fragments (rock, gravel) in the soil. High values can reduce water and nutrient availability for plants.</li>
          <li><strong>Clay</strong>: The percentage of fine soil particles. Clay influences water retention, nutrient storage, and soil structure. High clay content improves water holding capacity but may cause drainage issues.</li>
          <li><strong>Nitrogen</strong>: Essential for plant growth. Nitrogen is a primary nutrient, and its concentration in soil affects fertility. It promotes leaf growth and green coloration in plants.</li>
          <li><strong>OCD (Organic Carbon Density)</strong>: Refers to the concentration of organic carbon in soil, which improves soil structure, water retention, and nutrient availability.</li>
          <li><strong>OCS (Organic Carbon Stock)</strong>: Measures the total amount of organic carbon stored in soil per unit area, important for understanding carbon sequestration and its role in mitigating climate change.</li>
          <li><strong>pH</strong>: Indicates the acidity or alkalinity of the soil. The pH level affects nutrient availability and microbial activity. Most plants prefer neutral to slightly acidic soils (pH 6-7).</li>
          <li><strong>Sand</strong>: Represents the percentage of sand particles in the soil. Sand improves drainage and aeration but reduces the soil's ability to retain water and nutrients.</li>
          <li><strong>Silt</strong>: A soil texture component that lies between sand and clay. Silt improves water retention and soil structure, making it fertile and good for plant growth.</li>
          <li><strong>SOC (Soil Organic Carbon)</strong>: Indicates the amount of organic carbon in the soil, improving soil fertility, structure, and overall ecosystem health.</li>
          <li><strong>Water Retention Values (WV0010, WV0033, WV1500)</strong>: These values indicate the soil's ability to retain water at different pressure levels, with higher values showing better water-holding capacity. Important for understanding how much water the soil can provide to plants.</li>
        </ul>
      </div>

      {
        loading ? (
          <div className="text-center text-lg">Loading...</div>
        ) : (
          
      

      <div className="grid grid-cols-1 gap-4">
        {soilData && soilData.properties && soilData.properties.layers && soilData.properties.layers.map((layer) => (
          <div key={layer.name} className="bg-white rounded-lg shadow-md p-4 transition-all duration-300 ease-in-out">
            <h2 
              className="text-2xl font-semibold mb-3 text-gray-800 cursor-pointer hover:text-green-600"
              onClick={() => toggleLayer(layer.name)}
            >
              {layer.name.toUpperCase()}
              <span className="ml-2">{expandedLayer === layer.name ? '▼' : '▶'}</span>
            </h2>
            <div className='flex flex-wrap'>
            {expandedLayer === layer.name && layer.depths.map((depth, index) => (
              <div key={index} className="mb-4 bg-gray-50 p-3 rounded ">
                <h3 className="text-xl font-medium text-blue-600">Depth: {depth.label}</h3>
                <ul className="list-disc list-inside ml-4 text-gray-700">
                  <li>Mean: {depth.values.mean}</li>
                  <li>Q0.05: {depth.values['Q0.05']}</li>
                  <li>Q0.5: {depth.values['Q0.5']}</li>
                  <li>Q0.95: {depth.values['Q0.95']}</li>
                  <li>Uncertainty: {depth.values.uncertainty}</li>
                </ul>
              </div>
            ))}
            </div>
          </div>
        ))}
      </div>
        )}
    </div>


      
  );
};

export default SoilDataComponent;
