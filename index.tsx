import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  ScrollView,
  StatusBar,
} from "react-native";
import React, { useEffect } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { router, useRouter, useFocusEffect } from "expo-router";

const WelcomeScreen = () => {
  const ring1padding = useSharedValue(0);
  const ring2padding = useSharedValue(0);

  const router = useRouter();

  const onFocus = () => {
    ring1padding.value = 0;
    ring2padding.value = 0;
    setTimeout(() => {
      ring1padding.value = withSpring(hp("4.5%"));
    }, 200);
    setTimeout(() => {
      ring2padding.value = withSpring(hp("4.5%"));
    }, 300);
    setTimeout(() => {
      router.push("/home");
    }, 1500);
  };

  useFocusEffect(onFocus);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Animated.View
        style={[
          styles.outerRing,
          {
            padding: ring1padding,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.innerRing,
            {
              padding: ring1padding,
            },
          ]}
        >
          <Image source={require("../assets/logo.jpg")} style={styles.img} />
        </Animated.View>
      </Animated.View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>Flavour Fusion</Text>
      </View>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E67E22",
  },
  outerRing: {
    borderRadius: 150,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  innerRing: {
    borderRadius: 150,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  img: {
    width: hp("20%"),
    height: hp("20%"),
    borderRadius: 150,
  },
  textContainer: {
    marginTop: 20,
  },
  text: {
    color: "white",
    fontSize: hp("5%"),
    fontFamily: "SpaceMono",
  },
});
