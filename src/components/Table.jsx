import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient.js';
import Map from './map';

export default function Table() {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      
        const { data, error } = await supabase .from('measurements') .select();
        if (error) {
          console.log(error);
        }else{
          setDatos(data);
         
          setLoading(false);
          
        
      } 
    }

    fetchData();
  }, []);

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <div>
      <h2>Tabla</h2>
      <table className='table-auto w-full border text-left'>
        <thead>
          <tr>
            <th className='px-4 py-2 border bg-blue-200 border-black'>Station ID</th>
            <th className='px-4 py-2 border bg-blue-200 border-black'>Temperature</th>
            <th className='px-4 py-2 border bg-blue-200 border-black'>Humidity</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((row) => (
            <tr key={row.id}>
              
              <td className='px-4 py-2 border'>{row.station_id}</td>
              <td className='px-4 py-2 border'>{row.temperature}</td>
              <td className='px-4 py-2 border'>{row.humidity}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Map/>
    </div>
  );
}
