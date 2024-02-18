import axios from "axios";
import { apikey } from "../constants/const";

const forcastEndpoint = params => `https://api.weatherapi.com/v1/forecast.json?key=${apikey}&q=${params.cityName}&days=${params.days}&aqi=no`
const locationEndpoint = params => `https://api.weatherapi.com/v1/current.json?key=${apikey}&q=${params.cityName}`

const apiCall = async(endpoint) => {
    const options = {
        method:'GET',
        url: endpoint
    }
    try{
         const response = await axios.request(options);
         return response.data;
    }catch(error){
        console.log("error", error);
        return null;
    }
} 

export const exportWeatherForecast = params => {
    let forecastUrl = forcastEndpoint(params);
    return apiCall(forecastUrl)
} 

export const fetchLocations = params => {
    return apiCall(locationEndpoint(params))
}