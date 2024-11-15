// utils/mapsApi.ts
import axios from 'axios';

const GOOGLE_MAPS_API_KEY = 'AIzaSyAXX6wqZUoKFNyFRElQ32tcUcuv_-tvIV4';

export const getRoute = async (origin, destination) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/directions/json`,
      {
        params: {
          origin: `${origin.latitude},${origin.longitude}`,
          destination: `${destination.latitude},${destination.longitude}`,
          mode: 'bicycling',
          key: GOOGLE_MAPS_API_KEY,
        },
      }
    );
    return response.data.routes[0].overview_polyline.points;
  } catch (error) {
    console.error("Error al obtener la ruta:", error);
    throw error;
  }
};
