import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useRef } from "react";
import { Link } from "expo-router";
import { ListingsRoot } from "../interfaces/listings";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";


interface ListingsProps {
  listings: ListingsRoot[];
  category: string;
}

const Listings = ({ listings, category }: ListingsProps) => {
  const listRef = useRef<FlatList>(null);

  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 200);
  }, [category]);




  return (
    <View>
      <FlatList
      renderItem={({item, index}:{item: ListingsRoot, index: number}) => (<Link 
        key={index}
        href={`/listing/${item.id}`} asChild>
          <TouchableOpacity>
            <Animated.View style={styles.listing} entering={FadeInRight} exiting={FadeOutLeft} >
            <Image source={{ uri: item.medium_url }}  style={styles.listImage}/>
            <TouchableOpacity style={{ position: 'absolute', right: 30, top: 30 }}>
              <Ionicons  name="heart-outline" size={24} color={'red'} />
            </TouchableOpacity>

            <View style={{ flexDirection: "row", justifyContent: 'space-between'}}>
              <Text numberOfLines={2} style={{ fontFamily: "mono_semi_bold", fontSize: 16, flexShrink: 1 }}> {item.name} </Text>
              <View style={{ flexDirection: 'row', gap: 4 }}>
                <Ionicons name="star" size={16} />
                <Text style={{ fontFamily: "mono_semi_bold"}} > {item.review_scores_rating / 20} </Text>
              </View>
            </View>

            <Text style={{ fontFamily: "mono_regular"}} > {item.room_type} </Text>   

            <View style={{ flexDirection: "row", gap: 4 }}>
            <Text style={{ fontFamily: "mono_semi_bold"}} > € {item.price} </Text>
            <Text style={{ fontFamily: "mono_regular"}} > night</Text>  
            </View>    


            </Animated.View>
          </TouchableOpacity>
        </Link>)}
        ref={listRef}
        data={loading ? [] : listings}
        keyExtractor={(item: ListingsRoot) => item.id}
      />
    </View>
  );
};

export default Listings;

const styles = StyleSheet.create({
  listing: {
    padding: 16,
    gap: 10,
    marginVertical: 16
  }, 
  listImage: {
    width: "100%",
    // height: 300
    aspectRatio: 200 / 150,
    borderRadius: 10
  }
});
