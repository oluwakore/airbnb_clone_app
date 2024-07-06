import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import { Stack } from 'expo-router'
import ExploreHeader from '../../components/ExploreHeader'
import Listings from '../../components/Listings'
import ListingsGeoData from '../../assets/data/airbnb-listings.geo.json'
import ListingsMap from '../../components/ListingsMap'

const MainPage = () => {


  const fetchListings = async() => {
    try{
      const results = await fetch('https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/airbnb-listings/records?limit=40')
      const json = await results.json()
      setListings(json.results)
    } catch(err) {
      console.error('Unable to fetch listings')
    }
  }

  const [category, setCategory] = React.useState<string>('Tiny homes')

  const [listings, setListings] = React.useState<any[]>([])
  
  const onDataChanged = (category: string) => {
    // console.log(category)
    setCategory(category)
  }

  React.useEffect(() => {
    (async() => {
     await fetchListings()
    })()
  }, [])

  // console.log(listings.length)

  return (
    <View style={{ flex: 1, marginTop: 130}}>
      <Stack.Screen 
      options={{
        header: () => <ExploreHeader onCategoryChanged={onDataChanged} />
      }}
      />
      {/* <Listings category={category} listings={listings} /> */}
      <ListingsMap geoData={listings} />
    </View>
  )
}

export default MainPage