import React, { useEffect, useState } from "react";
import firebase from "firebase";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  Alert,
  TextInput,
  TouchableHighlight,
  TouchableOpacity
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  RectButton,
  ScrollView,
  TouchableWithoutFeedback
} from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import styles from "../AppStyles";
import cansIcon from "../assets/images/can.png";
import Colors from "../constants/Colors";
import StarRating from "react-native-star-rating";
import Modal from "react-native-modal";

export default function ProfileScreen() {
  const [imageUrl, setImageUrl] = useState();
  const user = firebase.auth().currentUser;
  const profilePictureRef = firebase
    .storage()
    .ref()
    .child(`images/profiles/${user.uid}`);
  const infoRef = firebase.database().ref(`users/${user.uid}`);
  const [nameInput, setNameInput] = useState({ name: "", address: "" });
  const [addressInput, setAddressInput] = useState({ name: "", address: "" });
  const [nameFrom, setNameFrom] = useState();
  const [addressFrom, setAddressFrom] = useState();
  const [showEditForm, setShowEditForm] = useState();

  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const getProfilePicture = async () => {
      const url = await profilePictureRef.getDownloadURL();
      setImageUrl(url);
    };
    getProfilePicture();
  });

  handleChange = e => {
    setNameInput({
      name: e.nativeEvent.text
    });
  };

  handleChangeAddress = e => {
    setAddressInput({
      address: e.nativeEvent.text
    });
  };

  let addName = (nameInput, addressInput) => {
    infoRef.set({
      name: nameInput,
      address: addressInput
    });
  };

  let addAddress = (nameInput, addressInput) => {
    infoRef.set({
      name: nameInput,
      address: addressInput
    });
  };

  handleSubmit = () => {
    addName(nameInput.name, addressInput.address);
  };

  handleSubmitAddress = () => {
    addAddress(nameInput.name, addressInput.address);
  };

  const logout = async () => {
    try {
      await firebase.auth().signOut();
      dispatch(setUser(null));
    } catch (e) {
      Alert.alert(e.name, e.message);
    }
  };

  onChooseImagePress = async () => {
    let result = await ImagePicker.launchImageLibraryAsync();

    if (!result.cancelled) {
      try {
        await this.uploadImage(result.uri);
      } catch (error) {
        Alert.alert("error", `Error: ${error}`);
      }
    }
  };

  uploadImage = async uri => {
    const response = await fetch(uri);
    const blob = await response.blob();

    await profilePictureRef.put(blob);
    const url = await profilePictureRef.getDownloadURL();
    setImageUrl(url);
  };

  getName = () => {
    infoRef.on(
      "child_added",
      function(snapshot) {
        console.log(snapshot.val());
        setNameFrom(snapshot.val());
      },
      function(errorObject) {
        console.log("The read failed: " + errorObject.code);
      }
    );
  };

  getAddress = () => {
    infoRef.once(
      "child_added",
      function(snapshot) {
        console.log(snapshot.val());
        setAddressFrom(snapshot.val());
      },
      function(errorObject) {
        console.log("The read failed: " + errorObject.code);
      }
    );
  };

  saveAndDisplayName = () => {
    this.handleSubmit();
    this.getName();
  };

  saveAndDisplayAddress = () => {
    this.handleSubmitAddress();
    this.getAddress();
  };

  saveAndDisplayAll = () => {
    this.saveAndDisplayName();
    this.saveAndDisplayAddress();
    setIsModalVisible(false);
    //setShowEditForm(false);
  };

  return (
    <ScrollView
      style={profileStyles.container}
      contentContainerStyle={profileStyles.contentContainer}
    >
      <Image
        style={profileStyles.backgroundImage}
        source={require("../assets/images/background-wave.png")}
      />

      <View style={profileStyles.topInfo}>
        <Image
          resizeMode="cover"
          style={profileStyles.profilePicture}
          source={{ uri: imageUrl }}
        />

        <TouchableOpacity
          style={profileStyles.editButtonPlacement}
          size={25}
          onPress={() => setIsModalVisible(true)}
        >
          <Image
            style={profileStyles.editButton}
            source={require("../assets/images/setting-white.png")}
          />
        </TouchableOpacity>
        <Modal isVisible={isModalVisible} style={{ backgroundColor: "white" }}>
          <View>
            <Text>Ändra namn:</Text>
            <TextInput
              style={profileStyles.nameInput}
              onChange={handleChange}
            />
            <Text>Ändra adress:</Text>
            <TextInput
              style={{
                paddingLeft: 20,
                height: 30,
                width: 200,
                borderColor: "gray",
                borderWidth: 1
              }}
              onChange={handleChangeAddress}
            />
            <View style={profileStyles.saveButtonPlacement}>
              <Button
                title="Spara"
                onPress={saveAndDisplayAll}
              />
            </View>
          </View>
        </Modal>

        <TouchableOpacity
          style={profileStyles.cameraButtonPlacement}
          onPress={this.onChooseImagePress}
        >
          <Image
            style={profileStyles.cameraButton}
            source={require("../assets/images/camera-white.png")}
          />
        </TouchableOpacity>

        <View style={profileStyles.infoNameAndFollowers}>
          <Text style={profileStyles.textName}>
            För- och efternamn: {nameFrom}
          </Text>

          <View style={profileStyles.followers}>
            <Text style={profileStyles.textFollowers}>Antal följare:</Text>
          </View>
        </View>
      </View>

      <View style={profileStyles.displayPantContainer}>
        <View style={profileStyles.pantAmountColumn}>
          <View style={profileStyles.pantAmountRow}>
            <Image style={profileStyles.iconCan} source={cansIcon} />
            <Text style={profileStyles.amountText}>249</Text>
          </View>
          <Text style={profileStyles.descriptionText}>burkar</Text>
        </View>
        <View style={profileStyles.pantAmountColumn}>
          <View style={profileStyles.pantAmountRow}>
            <Image style={profileStyles.iconCan} source={cansIcon} />
            <Text style={profileStyles.amountText}>10</Text>
          </View>
          <Text style={profileStyles.descriptionText}>flaskor</Text>
        </View>
        <View style={profileStyles.pantAmountColumn}>
          <View style={profileStyles.pantAmountRow}>
            <Image style={profileStyles.iconCan} source={cansIcon} />
            <Text style={profileStyles.amountText}>198</Text>
          </View>
          <Text style={profileStyles.descriptionText}>kronor</Text>
        </View>
      </View>

      <View style={profileStyles.recension}>
        <Text style={profileStyles.recensionText}>Recensioner</Text>
        <StarRating
          maxStars={5}
          starSize={24}
          rating={2}
          fullStarColor={"#FADA6D"}
          emptyStarColor={"#FADA6D"}
          starStyle={profileStyles.star}
        ></StarRating>
      </View>

      <View style={profileStyles.userInfoBlackText}>
        <Text style={profileStyles.textEmail}>
          E-postadress:{" "}
          <Text style={profileStyles.textInfoEmail}>
            {user ? user.email : "None"}
          </Text>
        </Text>

        <Text style={{ fontSize: 20, paddingLeft: 20 }}>
          Adress: {addressFrom}
        </Text>

        <Text style={{ fontSize: 20, paddingLeft: 20 }}>Poäng:</Text>
      </View>

      <View style={profileStyles.logOutButtonPlacement}>
        <TouchableOpacity
          style={profileStyles.greenButton}
          title="Logga ut"
          onPress={logout}
        >
          <Text style={profileStyles.whiteText}>Logga ut</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function OptionButton({ icon, label, onPress, isLastOption }) {
  return (
    <RectButton
      style={[styles.option, isLastOption && styles.lastOption]}
      onPress={onPress}
    >
      <View style={{ flexDirection: "row" }}>
        <View style={profileStyles.optionIconContainer}>
          <Ionicons name={icon} size={22} color="rgba(0,0,0,0.35)" />
        </View>
        <View style={profileStyles.optionTextContainer}>
          <Text style={profileStyles.optionText}>{label}</Text>
        </View>
      </View>
    </RectButton>
  );
}

const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa"
  },

  contentContainer: {
    paddingTop: 15
  },

  optionIconContainer: {
    marginRight: 12
  },

  option: {
    backgroundColor: "#fdfdfd",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    borderColor: "#ededed"
  },

  lastOption: {
    borderBottomWidth: StyleSheet.hairlineWidth
  },

  optionText: {
    fontSize: 15,
    alignSelf: "flex-start",
    marginTop: 1
  },

  backgroundImage: {
    //flex: 1,
    //alignSelf: "flex-end",
    //resizeMode: 'cover',
    position: "absolute",
    width: "100%",
    height: "83%"
  },

  profilePicture: {
    flex: 1,
    height: 115,
    width: 115,
    top: 10,
    borderRadius: 300 / 2,
    overflow: "hidden"
  },

  topInfo: {
    justifyContent: "center",
    alignItems: "center"
  },

  editButtonPlacement: {
    margin: 5,
    position: "absolute",
    top: 15,
    right: 35
  },

  editButton: {
    height: 30,
    width: 30
  },

  cameraButtonPlacement: {
    position: "absolute",
    top: 110,
    right: 115
  },

  cameraButton: {
    height: 20,
    width: 30
  },

  infoNameAndFollowers: {
    top: 25,
    justifyContent: "center",
    alignItems: "center"
  },

  textName: {
    fontSize: 26,
    color: "white"
  },

  followers: {
    top: 10
  },

  textFollowers: {
    fontSize: 20,
    color: "#228669"
  },

  nameInput: {
    paddingLeft: 20,
    height: 30,
    width: 200,
    borderColor: "gray",
    borderWidth: 1,
    justifyContent: "flex-end"
  },

  userInfoBlackText: {
    top: 120
  },

  textEmail: {
    fontSize: 20,
    paddingLeft: 20,
    fontWeight: "bold"
  },

  textInfoEmail: {
    fontSize: 18,
    color: "grey"
  },

  whiteText: {
    color: "white",
    fontWeight: "500"
  },

  wrapper: {
    padding: 10
  },

  saveButtonPlacement: {
    alignItems: "center",
    top: 130
  },

  logOutButtonPlacement: {
    alignItems: "center"
  },

  greenButton: {
    borderRadius: 20,
    backgroundColor: "#228669",
    height: 40,
    width: 100,
    justifyContent: "center",
    alignItems: "center",
    top: 130
  },

  iconCan: {
    width: 32,
    height: 40
  },

  displayPantContainer: {
    flexDirection: "row",
    paddingTop: 60,
    justifyContent: "center"
  },

  pantAmountColumn: {
    flexDirection: "column",
    flex: 1,
    alignItems: "flex-start",
    alignItems: "center"
  },

  pantAmountRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 30
  },

  amountText: {
    fontSize: 20,
    color: "white",
    paddingLeft: 10
  },

  descriptionText: {
    fontSize: 16,
    color: Colors.mediumGreen,
    paddingTop: 10
  },

  star: {
    marginRight: 5,
    paddingTop: 10,
  },

  recension: {
    top: 85,
    left: 30,
  },

  recensionText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
