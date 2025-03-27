import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Read the GeoJSON file
    const filePath = path.join(process.cwd(), 'public', 'countries.geo.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const geoData = JSON.parse(fileContent);

    // Transform GeoJSON features into the required format
    const countries = geoData.features.map(feature => ({
      name: feature.properties.name,
      code: feature.id
    }));

    // Sort countries alphabetically
    countries.sort((a, b) => a.name.localeCompare(b.name));

    res.status(200).json(countries);
  } catch (error) {
    console.error('Error loading countries:', error);
    res.status(500).json({ message: 'Error loading countries' });
  }
}