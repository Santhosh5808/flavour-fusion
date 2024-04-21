import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import Axios from "axios";
import {
  Entypo,
  AntDesign,
  FontAwesome,
  Ionicons,
  FontAwesome5,
  Octicons,
} from "@expo/vector-icons";
import YoutubeIframe from "react-native-youtube-iframe";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

const RecipePage = () => {
  const [mealData, setMealData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams();
  const { recipe } = params;
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setLoading(true);
    Axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipe}`)
      .then(({ data }) => {
        setLoading(false);
        setMealData(data.meals[0]);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }, [recipe]);
  return (
    <>
      {loading ? (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#FFC107" />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            backgroundColor: "white",
          }}
        >
          <StatusBar barStyle="light-content" />
          <View style={styles.imgContainer}>
            <Image
              source={{ uri: mealData?.strMealThumb }}
              style={styles.img}
            />
          </View>
          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => {
                router.back();
              }}
            >
              <Entypo name="chevron-left" size={40} color="black" />
            </TouchableOpacity>
          </View>
          <View style={styles.btnContainer2}>
            <TouchableOpacity
              style={styles.btn2}
              onPress={() => {
                setIsFavorite(!isFavorite);
              }}
            >
              <AntDesign
                name="heart"
                size={26}
                color={isFavorite ? "red" : "gray"}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.text}>{mealData?.strMeal}</Text>
            <Text style={styles.category}>{mealData?.strCategory}</Text>
          </View>
          <View style={styles.miscContainer}>
            <View style={styles.miscItem}>
              <View style={styles.icon}>
                <FontAwesome name="clock-o" size={30} color="black" />
              </View>
              <Text style={styles.time}>35</Text>
              <Text style={styles.timeSub}>mins</Text>
            </View>
            <View style={styles.miscItem}>
              <View style={styles.icon}>
                <Ionicons name="people" size={30} color="black" />
              </View>
              <Text style={styles.time}>03</Text>
              <Text style={styles.timeSub}>Servings</Text>
            </View>
            <View style={styles.miscItem}>
              <View style={styles.icon}>
                <FontAwesome5 name="fire" size={30} color="black" />
              </View>
              <Text style={styles.time}>255</Text>
              <Text style={styles.timeSub}>Calories</Text>
            </View>
            <View style={styles.miscItem}>
              <View style={styles.icon}>
                <Octicons name="stack" size={30} color="black" />
              </View>
              <Text style={styles.time}>Easy</Text>
              <Text style={styles.timeSub}>Difficulty</Text>
            </View>
          </View>
          <View style={styles.ingredientContainer}>
            <Text style={styles.ingredientText}>Ingredients</Text>
            <View style={styles.ingredientList}>
              {Object.keys(mealData).map((key, index) => {
                if (key.includes("strIngredient") && mealData[key]) {
                  return (
                    <View
                      key={index}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingVertical: 2,
                      }}
                    >
                      <FontAwesome
                        name="circle"
                        size={10}
                        color="#FFC107"
                        style={{ marginRight: 5 }}
                      />
                      <Text>{mealData[key]}</Text>
                    </View>
                  );
                }
              })}
            </View>

            <Text style={styles.ingredientText}>Instructions</Text>
            <View style={styles.ingredientList}>
              {Object.keys(mealData).length !== 0 &&
                mealData?.strInstructions
                  .split(". ")
                  .map((item: any, index: any) => {
                    return (
                      <Text
                        key={index}
                        style={{
                          fontSize: 16,
                          marginBottom: 5,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FontAwesome name="circle" size={10} color="#FFC107" />
                        {" " + item}
                      </Text>
                    );
                  })}
            </View>
          </View>
          <View style={styles.youTubeContainer}>
            <Text style={styles.recipeText}>Recipe Video</Text>
            <YoutubeIframe
              height={hp("30%")}
              videoId={
                Object.keys(mealData).length !== 0 &&
                mealData?.strYoutube.split("=")[1]
              }
            />
          </View>
        </ScrollView>
      )}
    </>
  );
};

export default RecipePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
    justifyContent: "center",
  },
  img: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 30,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  imgContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  btnContainer: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  btnContainer2: {
    position: "absolute",
    top: 50,
    right: 20,
  },
  btn: {
    justifyContent: "center",
    alignItems: "center",
    aspectRatio: 1,
    backgroundColor: "white",
    borderRadius: 50,
    opacity: 0.85,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.9,
    borderColor: "#f5f5f5",
    borderWidth: 1,
    width: 45,
  },
  btn2: {
    justifyContent: "center",
    alignItems: "center",
    aspectRatio: 1,
    backgroundColor: "white",
    borderRadius: 50,
    opacity: 0.85,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.9,
    borderColor: "#f5f5f5",
    borderWidth: 1,
    width: 45,
    padding: 5,
  },
  textContainer: {
    alignItems: "flex-start",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  text: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "left",
  },
  category: {
    fontSize: 16,
    color: "gray",
  },
  miscContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    gap: 12,
  },
  miscItem: {
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#FFC107",
    borderRadius: 45,
    padding: 10,
    paddingHorizontal: 5,
  },
  time: {
    fontSize: 20,
    fontWeight: "bold",
  },
  timeSub: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
  },
  icon: {
    backgroundColor: "white",
    borderRadius: 50,
    padding: 5,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  ingredientContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  ingredientList: {
    padding: 10,
  },
  ingredientText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  recipeText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  youTubeContainer: {
    paddingHorizontal: 20,
  },
});
