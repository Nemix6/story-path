import { FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, View, StyleSheet } from "react-native";
import { Button } from "react-native-elements";

export default function Home() {

  return (
    <View style={styles.container}>
      <FontAwesome5 name="book-reader" size={100} color="#fc6f03" style={styles.icon} />
      <Text style={styles.title_text}>Welcome to StoryPath</Text>
      <Text style={styles.text}>Explore Unlimited Location-based Experiences</Text>
      <View style={styles.box}>
        <Text style={styles.box_text}>A platform for creating, sharing, and experiencing location-based stories and experiences. From virtual museum exhibits to treasure hunts, the possibilities are endless!</Text>
      </View>

      {/* must style view instead since button component does not accept custom styling*/}
      <View style={styles.button_container}>
        <Button title="CREATE PROFILE" style={styles.icon} onPress={() => router.push("/profile")}/>
      </View>
      {/* two seperate button container so i can add a margin between the buttons */}
      <View style={styles.button_container}>
        <Button title="EXPLORE PROJECTS" style={styles.icon} onPress={() => router.push("/projectLists")}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    paddingHorizontal: 20,
    marginTop: 20,
    alignItems: "center",
  },

  icon : {
    marginTop: 10,
  },

  title_text : {
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 15,
    color: "#fc6f03",
  },

  text : {
    fontSize: 18,
    marginTop: 20,
    textAlign: "center",
  },

  box_text : {
    fontSize: 15,
    textAlign: "center",
  },

  box : {
    marginTop: 20,
    marginBottom: 20,
    padding: 10,
    borderRadius: 8,
    borderWidth: 0.2,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    borderColor: "black",
    backgroundColor: "white",
  },

  button_container : {
    width: '100%',
    marginTop: 12,
  },
});