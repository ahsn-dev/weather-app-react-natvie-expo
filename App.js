import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Fontisto } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const API_KEY = "784ab24ff2ed5d94d4288abed9e25d13";

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightning",
};

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [daysTemp, setDaysTemp] = useState([]);
  const [ok, setOk] = useState(true);
  const [dayOfWeek, setDayOfWeek] = useState(null);
  const [today, setToday] = useState(null);

  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setCity(location[0].city);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`
    );
    const json = await response.json();
    setDaysTemp(json.daily);

    const currentDate = new Date();
    const dayOfWeekValue = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
    }).format(currentDate);
    const dayOfMonth = currentDate.getDate();
    const monthName = new Intl.DateTimeFormat("en-US", {
      month: "long",
    }).format(currentDate);
    setDayOfWeek(dayOfWeekValue);
    setToday(`${dayOfMonth} ${monthName}`);
  };
  useEffect(() => {
    getWeather();
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.city}>
        <Text style={styles.cityName}>{city.toUpperCase()}</Text>
      </View>

      <View style={{ flex: 2, justifyContent: "center" }}>
        <Text style={styles.dayOfWeek}>{dayOfWeek}</Text>
        <Text style={styles.today}>{today}</Text>
      </View>

      <View style={styles.line} />

      <ScrollView
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        {daysTemp?.length === 0 ? (
          <View style={{ ...styles.dayTemp, alignItems: "center" }}>
            <ActivityIndicator
              color="#010033"
              style={{ marginTop: 10 }}
              size="large"
            />
          </View>
        ) : (
          daysTemp?.map((dayTemp, index) => (
            <View key={index} style={styles.dayTemp}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.temp}>
                  {parseFloat(dayTemp.temp.day).toFixed(0)}
                  {"°"}
                </Text>
                <Fontisto
                  name={icons[dayTemp.weather[0].main]}
                  size={68}
                  color="#010033"
                  style={{ marginTop: 30 }}
                />
              </View>

              <Text style={styles.description}>{dayTemp.weather[0].main}</Text>
              <Text style={styles.tinyText}>
                {dayTemp.weather[0].description}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFCF08",
  },

  city: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },

  cityName: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#010033",
  },

  line: {
    borderBottomWidth: 2,
    borderBottomColor: "#010033",
    marginHorizontal: 20,
    marginBottom: 10,
  },

  dayOfWeek: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#010033",
    marginBottom: 4,
    marginLeft: 10,
    paddingHorizontal: 20,
  },

  today: {
    fontSize: 20,
    fontWeight: "400",
    color: "#010033",
    marginLeft: 10,
    paddingHorizontal: 20,
  },

  dayTemp: {
    width: SCREEN_WIDTH,
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },

  temp: {
    marginTop: 50,
    fontWeight: "600",
    fontSize: 140,
    color: "#010033",
  },

  description: {
    marginTop: -10,
    fontSize: 30,
    color: "#010033",
    fontWeight: "400",
    marginLeft: 10,
  },

  tinyText: {
    marginTop: -5,
    fontSize: 20,
    color: "#010033",
    fontWeight: "400",
    marginLeft: 10,
  },
});
