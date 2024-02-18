import React, { useCallback, useState, useEffect } from 'react';
import { fetchweatherForecast, fetchLocations } from '../Api/weather';
import { View, SafeAreaView, TextInput, Text, Image, StatusBar, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { CalendarDaysIcon, MagnifyingGlassIcon, MapPinIcon } from 'react-native-heroicons/outline';
import {debounce} from 'lodash';
import * as Progress from 'react-native-progress';

const Main = () => {
const [showsearch, togglesearch] = useState(false);
const [Location, setLocation] = useState([1, 2, 3]);
const [weather,setweather] = useState({});
const[loading,setLoading] = useState(true);
const handlelocation = (loc) =>{
console.log('location',loc);
setLocation([]);
togglesearch(false)
setLoading(true);
fetchweatherForecast({
cityName:loc.name,
days:'7'
}).then(data=>{
setweather(data);
setLoading(false)
console.log('got forecast data',data);
})
}

const handlesearch = value => {
  // Fetch location
  if ((value ?? '').length > 2) {
    fetchLocations({ cityName: value }).then(data => {
      console.log('get location', data);
      setLocation(data);
    });
  }
};

useEffect(()=>{
fetchMyWeatherData();
},[])
const fetchMyWeatherData = async () => {
  fetchweatherForecast({
    cityName:'Nairobi',
    days:'7'
  }).then(data=>{
    setweather(data);
    setLoading(false)
  })
}
const handletextdebounce = useCallback(debounce(handlesearch, 3200), []);
const {current , location} = weather;
return (
  <View style={{ flex: 1, position: 'relative' }}>
    {loading ? (
      <View style={{ flex: 1, flexDirection: 'row', alignSelf: 'center', justifyContent: 'center' }}>
        <Progress.CircleSnail thickness={10} size={140} color={'#0bb3b2'} />
      </View>
    ) : (
      <>
        <StatusBar barStyle="light-content" />
        <Image
          blurRadius={30}
          source={require('../Assets/Best-Wallpapers-14.jpg')}
          style={{
            flex: 1,
            width: '100%',
            height: '100%',
            position: 'absolute',
          }}
          resizeMode="cover"
        />
        <SafeAreaView style={{ flex: 1 }}>
          {/* ..................................Search section........................... */}
          <View style={{ marginTop: 5, alignItems: 'center' }}>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: showsearch ? 'white' : 'transparent',
                height: 35,
                borderRadius: 15,
                width: '90%',
                alignItems: 'center',
                paddingHorizontal: 10,
              }}
            >
              {showsearch ? (
                <TextInput
                  onChangeText={handletextdebounce}
                  placeholder="Search city"
                  placeholderTextColor="#222222"
                  style={{ color: '#222222', flex: 1 }}
                />
              ) : null}
              <TouchableOpacity
                style={{ backgroundColor: '#dddddd', margin: 1, padding: 3, borderRadius: 10 }}
                onPress={() => togglesearch(!showsearch)}
              >
                <MagnifyingGlassIcon size={25} color="#999999" />
              </TouchableOpacity>
            </View>

            {location.length > 0 && showsearch ? (
              <View
                style={{
                  backgroundColor: 'grey',
                  position: 'relative',
                  borderRadius: 10,
                  width: '80%',
                  alignSelf: 'center',
                  marginTop: 10,
                }}
              >
                {location.map((loc, index) => {
                  const showborder = index + 1 !== location.length;
                  const borderclass = showborder ? { borderBottomWidth: 1, borderColor: 'white' } : {};
                  return (
                    <TouchableOpacity onPress={() => handlelocation(loc)} key={index} style={{ flexDirection: 'row', padding: 3, marginBottom: 4, ...borderclass }}>
                      <MapPinIcon size={20} color="white" />
                      <Text>{loc?.name},{loc?.country}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null}
          </View>
          {/*.................forecast section................. */}
          <View style={{ flex: 1, justifyContent: 'center', position: 'absolute', alignSelf: 'center', paddingTop: 135 }}>
            {/*............location.......... */}
            <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 30 }}>
              {location?.name}, <Text style={{ fontWeight: '800', color: '#eeeeee', fontSize: 25 }}>{" " + location?.country}</Text>
            </Text>
            {/*................weather images............ */}
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Image source={{ uri: 'https:' + current?.condition?.icon }} style={{ paddingTop: 20, height: 350, width: 250 }} />
            </View>
            {/*..........degree celcious......... */}
            <View style={{}}>
              <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 45 }}>
                {current?.temp_c}&deg;
              </Text>
              <Text style={{ textAlign: 'center', fontSize: 25, letterSpacing: 2 }}>
                {current?.condition?.text}
              </Text>
            </View>
            {/*.............other stats............. */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 2 }}>
              <View style={{ paddingHorizontal: 4, flexDirection: 'row', alignSelf: 'center' }}>
                <Image source={require('../Assets/wind.png')} style={{ height: 50, width: 50 }} />
                <Text style={{ color: 'white', fontWeight: '600', paddingTop: 15 }}>{current?.wind_kph} km</Text>
              </View>
              <View style={{ paddingHorizontal: 4, flexDirection: 'row', alignSelf: 'center' }}>
                <Image source={require('../Assets/humidity.png')} style={{ height: 40, width: 40 }} />
                <Text style={{ color: 'white', fontWeight: '600', paddingTop: 10 }}>{current?.humidity} %</Text>
              </View>
              <View style={{ paddingHorizontal: 4, flexDirection: 'row', alignSelf: 'center' }}>
                <Image source={require('../Assets/sonne.png')} style={{ height: 35, width: 35 }} />
                <Text style={{ color: 'white', fontWeight: '600', paddingTop: 10 }}>0605hrs</Text>
              </View>
            </View>
          </View>
          {/*..........forecast section......... */}
          <View style={{ marginBottom: 3, paddingVertical: 3, position: 'absolute', marginTop: 670 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 42 }}>
              <CalendarDaysIcon color={'white'} size={22} />
              <Text>Daily forecast</Text>
            </View>
            <ScrollView horizontal style={{ paddingHorizontal: 20 }} showsHorizontalScrollIndicator={false}>
              {weather?.forecast?.forecastday.map((item, index) => {
                let date = new Date(item.date);
                let options = { weekday: 'long' };
                let dayName = date.toLocaleDateString('en-US', options);
                return (
                  <View key={index} style={{ justifyContent: 'center', paddingVertical: 3, width: 74, margin: 4, backgroundColor: '#444444', borderRadius: 20 }}>
                    <Image source={weatherImages[item?.day?.condition?.text]} style={{ height: 60, width: 60, alignSelf: 'center' }} />
                    <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 15 }}>{dayName}</Text>
                    <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 25 }}>
                      {item?.day?.avgtemp_c}&deg;
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </SafeAreaView>
      </>
    )}
  </View>
);
};
export default Main;