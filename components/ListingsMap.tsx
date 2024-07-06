import * as React from "react";
import { Text, View, StyleSheet, SafeAreaView } from "react-native";
import { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from "react-native-maps";
import MapView from "react-native-map-clustering";
import { defaultStyles } from "../constants/Styles";
import { ListingsRoot } from "../interfaces/listings";
import { router } from "expo-router";

interface ListingsMapProps {
  geoData: ListingsRoot[];
}

const INITIAL_REGION = {
  latitude: 37.33,
  longitude: -122,
  latitudeDelta: 9,
  longitudeDelta: 9,
};

const ListingsMap = (props: ListingsMapProps) => {
  const [latLongArr, setLatLongArr] = React.useState<
    { lat: number; lon: number; id: string; price: number }[]
  >([]);

  const extractLatLong = () => {
    let extArr: { lat: number; lon: number; id: string; price: number }[] = [];
    props.geoData.forEach((item: ListingsRoot) => {
      const lat = Number(item.latitude);
      const lon = Number(item.longitude);
      const id = item.id;
      const price = item.price;
      extArr.push({ lat, lon, id, price });
    });
    // console.log('gart', extArr)
    setLatLongArr(extArr);
  };

  React.useEffect(() => {
    (async () => {
      extractLatLong();
    })();
  }, []);

  // console.log('val',props.geoData)

  const onMarkerSelected = (index: number, id: string) => {
    // console.log(props.geoData[index]);
    router.push(`/listing/${id}`);
  };


  const renderCluster = (cluster: any) => {
    const {id, geometry, onPress, properties} = cluster
    const points = properties.point_count


    return (
      <Marker
      key={`cluster-${id}`}
      coordinate={{
        longitude: geometry.coordinates[0],
        latitude: geometry.coordinates[1]
      }}
      >
        <View><Text>Test</Text></View>
      </Marker>
    )
  }

  return (
    <SafeAreaView style={defaultStyles.container}>
      <MapView
        animationEnabled={false}
        showsUserLocation
        showsMyLocationButton
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_GOOGLE}
        clusterColor="#fff"
        clusterTextColor="#000"
        clusterFontFamily="mono_semi_bold"
        renderCluster={renderCluster}
        initialRegion={{
          latitude: -34.397,
          longitude: 150.644,
          latitudeDelta: 0.09,
          longitudeDelta: 0.03,
        }}
      >
        {latLongArr.map(
          (
            item: { lat: number; lon: number; id: string; price: number },
            index: number
          ) => (
            <Marker
              key={item.id}
              onPress={() => onMarkerSelected(index, item.id)}
              // description="Delivery person 1"
              coordinate={{ latitude: item.lat, longitude: item.lon }}
            >
              <View style={styles.marker}>
                <Text style={styles.markerText}>€ {item.price} </Text>
              </View>
            </Marker>
          )
        )}
      </MapView>
    </SafeAreaView>
  );
};

export default ListingsMap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  marker: {
    display: "flex",
    backgroundColor: "#ffff",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 1,
      height: 10,
    },
  },
  markerText: {
    fontSize: 14,
    fontFamily: "mono_semi_bold",
    margin: 2,
  },
});
