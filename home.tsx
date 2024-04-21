import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  BackHandler,
  StatusBar,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Platform, // Import Platform module
} from "react-native";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Category from "../components/categories";
import Axios from "axios";
import Recipes from "../components/recipes";

// Import ToastAndroid only for Android
let ToastAndroid = null;
if (Platform.OS === 'android') {
  ToastAndroid = require('react-native').ToastAndroid;
}

const HomeScreen = () => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("Beef");
  const [loading, setLoading] = useState(false);
  const [allCategories, setAllCategories] = useState<[string] | []>([]);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    setLoading(true);
    Axios.get(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${selected}`
    )
      .then(({ data }) => {
        setLoading(false);
        setRecipes(data.meals);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }, [selected]);

  useEffect(() => {
    Axios.get("https://www.themealdb.com/api/json/v1/1/categories.php")
      .then(({ data }) => {
        setAllCategories(data.categories);
        setSearch("");
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const getRecipes = () => {
    setLoading(true);
    Axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${search}`)
      .then(({ data }) => {
        setRecipes(data.meals);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  useEffect(() => {
    let backHandlerCount = 0;
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        backHandlerCount++;
        if (backHandlerCount === 1) {
          if (ToastAndroid) { // Check if ToastAndroid is available
            ToastAndroid.show("Press again to leave", ToastAndroid.SHORT);
          }
          setTimeout(() => {
            backHandlerCount = 0;
          }, 2000);
          return true;
        } else if (backHandlerCount === 2) {
          BackHandler.exitApp();
          return true;
        }
      }
    );

    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.icons}>
          <Image
            source={require("../assets/avatar.jpg")}
            style={{ width: hp(6.5), height: hp(6.5) }}
          />
          <AntDesign name="heart" size={30} color="red" />
        </View>
        <View style={styles.textContainer}>
          <Text style={{ fontSize: 18, fontFamily: "SpaceMono" }}>
            Hello, user!
          </Text>
          <Text style={{ fontSize: 30, fontFamily: "RobotoBold" }}>
            Make your own food, stay at{" "}
            <Text
              style={{
                color: "#FFC107",
                fontSize: 30,
                fontFamily: "RobotoBold",
              }}
            >
              Home!
            </Text>
          </Text>
        </View>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchBar}
            placeholder="Search a Recipe"
            value={search}
            onChange={(e) => setSearch(e.nativeEvent.text)}
            keyboardType="default"
            returnKeyType="search"
            onSubmitEditing={() => getRecipes()}
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => getRecipes()}
          >
            <FontAwesome name="search" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.categoryScrollContainer}>
          {allCategories.length > 0 && (
            <Category
              selected={selected}
              setSelected={setSelected}
              allCategories={allCategories}
            />
          )}
        </View>
        <Text style={styles.recipeText}>Recipes</Text>
        {!loading ? (
          <View style={styles.recipeContainer}>
            <Recipes selected={selected} recipes={recipes} />
          </View>
        ) : (
          <View
            style={{
              width: wp("90%"),
              marginTop: hp("12%"),
            }}
          >
            <ActivityIndicator size="large" color="#FFC107" />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
    paddingBottom: 0,
  },
  scrollContainer: {
    paddingTop: 20,
    paddingBottom: 50,
    width: "100%",
  },
  icons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  textContainer: {
    width: "100%",
    marginTop: 20,
  },
  searchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 20,
    backgroundColor: "#f5f5f5",
    paddingLeft: 15,
    paddingRight: 5,
    borderRadius: 40,
  },
  searchBar: {
    flex: 1,
    height: hp(7),
    fontFamily: "RobotoRegular",
  },
  searchButton: {
    backgroundColor: "white",
    padding: 8,
    borderRadius: 100,
  },
  categoryScrollContainer: {
    width: "100%",
  },
  recipeText: {
    fontSize: 24,
    color: "#111",
    fontFamily: "RobotoBold",
  },
  recipeContainer: {
    width: "100%",
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});