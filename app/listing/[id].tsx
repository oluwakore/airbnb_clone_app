import { View, Text, StyleSheet, Dimensions, StatusBar, Image, ScrollView, TouchableOpacity, Share } from "react-native";
import React, { useLayoutEffect } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { ListingsRoot } from "../../interfaces/listings";
import Animated, { SlideInDown, interpolate, useAnimatedRef, useAnimatedStyle, useScrollViewOffset } from "react-native-reanimated";
import Colors from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import Listings from "../../components/Listings";
import { defaultStyles } from "../../constants/Styles";

const { width } = Dimensions.get("window");

const PageIdPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  const scrollOffset = useScrollViewOffset(scrollRef)

  const urlStr = (value: any): string => {
    return value
  }

  const shareListing = async () => {
    const title = urlStr(listing?.name)
    const url = urlStr(listing?.listing_url)
    try {
      await Share.share({
        title: title,
        url: url,
        message: url
      });
    } catch (err) {
      console.log(err);
    }
  };

  const navigation = useNavigation()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerTransparent: true,

      headerBackground: () =>  loading ? ({}) : (
        <Animated.View style={[headerAnimatedStyle, styles.header]}></Animated.View>
      ),
      headerRight: () =>  loading ? ({}) :  (
        <View style={styles.bar}>
          <TouchableOpacity style={styles.roundButton} onPress={shareListing}>
            <Ionicons name="share-outline" size={22} color={'#000'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.roundButton}>
            <Ionicons name="heart-outline" size={22} color={'#000'} />
          </TouchableOpacity>
        </View>
      ),
      headerLeft: () =>  loading ? ({}) :  (
        <TouchableOpacity style={styles.roundButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={'#000'} />
        </TouchableOpacity>
      ),
    });
  }, []);


  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollOffset.value, [0, 300 / 1.5], [0, 1]),
    };
  }, []);

  const imageAnimatedStyle = useAnimatedStyle(() =>{
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-300, 0, 300],
            [-300 / 2, 0, 300 * .75]
          )
        },
        {
          scale: interpolate(scrollOffset.value,
            [-300, 0, 300],
            [2, 1,2]
          )
        }
      ]
    }
  })

  const [listing, setListing] = React.useState<ListingsRoot>();
  const [loading, setLoading] = React.useState<boolean>(false);

  const calcNoReviews = (value: any) => {
    return value / 20
  }

  const fetchListings = async () => {
    try {
      setLoading(true);
      const results = await fetch(
        "https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/airbnb-listings/records?limit=40"
      );
      const json = await results.json();
      // console.log(id)
      const foundItem: ListingsRoot = json.results.find(
        (item: ListingsRoot) => item.id == id
      );
      // console.log(foundItem)
      setListing(foundItem);
      setLoading(false);
    } catch (err) {
      console.error("Unable to fetch listing");
      setLoading(false);
    }
  };

  // console.log(listing)

  React.useEffect(() => {
    (async () => {
      await fetchListings();
    })();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontFamily: "mono_bold" }}>Loading your item...</Text>
      </View>
    )
  } else {

  return (
    <ScrollView style={styles.container}>
      <StatusBar hidden />
      <Animated.ScrollView
      ref={scrollRef}
      contentContainerStyle={{ paddingBottom: 10 }}
      scrollEventThrottle={16}
      >
        <Animated.Image
          source={{ uri: listing?.xl_picture_url }}
          style={[styles.xlImg, imageAnimatedStyle]} 
        />
      </Animated.ScrollView>

      <ScrollView style={styles.infoContainer}>
        <Text style={styles.name}>{listing?.name}</Text>
        <Text style={styles.location}>
          {listing?.room_type} in {listing?.smart_location}
        </Text>
        <Text style={styles.rooms}>
          {listing?.guests_included} guests · {listing?.bedrooms} bedrooms ·{" "}
          {listing?.beds} bed · {listing?.bathrooms} bathrooms
        </Text>
        <View style={{ flexDirection: "row", gap: 4 }}>
          <Ionicons name="star" size={16} />
          <Text style={styles.ratings}>
            {calcNoReviews(listing?.review_scores_rating)} : {}  · {listing?.number_of_reviews}{" "}
            reviews
          </Text>
        </View>
        <View style={styles.divider} />

        <View style={styles.hostView}>
          <Image
            source={{ uri: listing?.host_picture_url }}
            style={styles.host}
          />

          <View>
            <Text style={{ fontSize: 16, fontFamily: "mono_semi_bold" }}>
              Hosted by {listing?.host_name}
            </Text>
            <Text style={{ fontSize: 12, fontFamily: "mono_regular" }}>Host since {listing?.host_since}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.description}>{listing?.description}</Text>
        
      </ScrollView>

      <Animated.View style={defaultStyles.footer} entering={SlideInDown.delay(200)}>
        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <TouchableOpacity style={styles.footerText}>
            <Text style={styles.footerPrice}>€{listing?.price}</Text>
            <Text style={{ fontFamily: "mono_semi_bold"}} >night</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[defaultStyles.btn, { paddingRight: 20, paddingLeft: 20 }]}>
            <Text style={defaultStyles.btnText}>Reserve</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </ScrollView>
  );

    }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  xlImg: {
    width: width,
    height: 300
    // aspectRatio: 100 / 75,
  },
  infoContainer: {
    padding: 24,
    backgroundColor: "#fff",
  },
  name: {
    fontSize: 26,
    // fontWeight: "bold",
    fontFamily: "mono_bold",
  },
  location: {
    fontSize: 18,
    marginTop: 10,
    fontFamily: "mono_semi_bold",
  },
  rooms: {
    fontSize: 16,
    color: Colors.grey,
    marginVertical: 4,
    fontFamily: "mono_regular",
  },
  ratings: {
    fontSize: 16,
    fontFamily: "mono_semi_bold",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.grey,
    marginVertical: 16,
  },
  host: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: Colors.grey,
  },
  hostView: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  footerText: {
    height: "100%",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  footerPrice: {
    fontSize: 18,
    fontFamily: "mono_semi_bold",
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    color: Colors.primary,
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  header: {
    backgroundColor: "#fff",
    height: 100,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.grey,
  },

  description: {
    fontSize: 16,
    marginTop: 10,
    fontFamily: "mono_regular",
    textAlign: "justify",
    // borderColor: "red",
    // borderWidth: 2,
    // overflow: "scroll"
  },
});

export default PageIdPage;
