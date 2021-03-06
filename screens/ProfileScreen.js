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
  TouchableOpacity,
  Dimensions
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
import moneyIcon from "../assets/images/money.png";
import bottleIcon from "../assets/images/flaskor.png";
import Colors from "../constants/Colors";
import StarRating from "react-native-star-rating";
import Modal from "react-native-modal";
import { DisplayPantInfo } from "../components/DisplayPantInfo";

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

  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    getName();
    getAddress();
  }, []);

  useEffect(() => {
    const getProfilePicture = async () => {
      const url = await profilePictureRef.getDownloadURL();
      setImageUrl(url);
    };
    getProfilePicture();
  });

  let handleChange = e => {
    setNameInput({
      name: e.nativeEvent.text
    });
  };

  let handleChangeAddress = e => {
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

  let handleSubmit = () => {
    addName(nameInput.name, addressInput.address);
  };

  let handleSubmitAddress = () => {
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

  let onChooseImagePress = async () => {
    let result = await ImagePicker.launchImageLibraryAsync();

    if (!result.cancelled) {
      try {
        await uploadImage(result.uri);
      } catch (error) {
        Alert.alert("error", `Error: ${error}`);
      }
    }
  };

  let uploadImage = async uri => {
    const response = await fetch(uri);
    const blob = await response.blob();

    await profilePictureRef.put(blob);
    const url = await profilePictureRef.getDownloadURL();
    setImageUrl(url);
  };

  let getName = () => {
    infoRef.on(
      "child_added",
      function(snapshot) {
        setNameFrom(snapshot.val());
      },
      function(errorObject) {
        console.log("The read failed: " + errorObject.code);
      }
    );
  };

  let getAddress = () => {
    infoRef.once(
      "child_added",
      function(snapshot) {
        setAddressFrom(snapshot.val());
      },
      function(errorObject) {
        console.log("The read failed: " + errorObject.code);
      }
    );
  };

  let saveAndDisplayName = () => {
    handleSubmit();
    getName();
  };

  let saveAndDisplayAddress = () => {
    handleSubmitAddress();
    getAddress();
  };

  let saveAndDisplayAll = () => {
    saveAndDisplayName();
    saveAndDisplayAddress();
    setIsModalVisible(false);
  };

  return (
    <View style={profileStyles.container}>
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

          <Modal transparent={true} isVisible={isModalVisible}>
            <View style={profileStyles.modalContentContainer}>
              <View style={profileStyles.popupBackground}>
                <View style={profileStyles.modalHeaderContainer}>
                  <TouchableOpacity
                    style={profileStyles.closeModal}
                    onPress={() => setIsModalVisible(false)}
                  >
                    <Text style={{ color: "white", fontSize: 20 }}>X</Text>
                  </TouchableOpacity>
                </View>
                <Text style={profileStyles.settingText}>Inställningar</Text>
                <View>
                  <View style={{ top: 20 }}>
                    <Text style={profileStyles.changeNameText}>
                      Ändra namn:
                    </Text>
                  </View>
                </View>
                <View>
                  <View style={{ top: 30 }}>
                    <TextInput
                      style={profileStyles.settingInput}
                      onChange={handleChange}
                      placeholder={
                        nameFrom ? nameFrom : "Skriv ditt för- och efternamn..."
                      }
                    />
                    <Text style={profileStyles.changeAddressText}>
                      Ändra adress:
                    </Text>
                    <TextInput
                      style={profileStyles.settingInputAddress}
                      onChange={handleChangeAddress}
                      placeholder={
                        addressFrom ? addressFrom : "Skriv din adress..."
                      }
                    />
                  </View>
                </View>

                <View style={profileStyles.saveButtonPlacement}>
                  <TouchableOpacity
                    style={profileStyles.saveButtonGreen}
                    title="Spara"
                    onPress={saveAndDisplayAll}
                  >
                    <Text style={profileStyles.whiteText}>Spara</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          <TouchableOpacity
            style={profileStyles.cameraButtonPlacement}
            onPress={onChooseImagePress}
          >
            <Image
              style={profileStyles.cameraButton}
              source={require("../assets/images/camera-white.png")}
            />
          </TouchableOpacity>
          <View style={profileStyles.infoNameAndFollowers}>
            <Text style={profileStyles.textName}>
              {nameFrom ? nameFrom : "För- och efternamn:"}
            </Text>

            <View style={profileStyles.followers}>
              <Text style={profileStyles.textFollowers}>Antal följare:</Text>
            </View>
          </View>
        </View>

        <DisplayPantInfo />

        <View style={profileStyles.recension}>
          <Text style={profileStyles.recensionText}>Recensioner</Text>
          <StarRating
            maxStars={5}
            starSize={24}
            rating={2}
            fullStarColor={"#FADA6D"}
            emptyStarColor={"#FADA6D"}
            starStyle={profileStyles.star}
            containerStyle={profileStyles.starContainer}
          ></StarRating>
        </View>
        <View style={profileStyles.userInfoBlackText}>
          <Text style={profileStyles.textEmail}>
            E-postadress {"\n"}
            {""}
            <Text style={profileStyles.textInfoEmail}>
              {user ? user.email : "None"} {"\n"}
            </Text>
          </Text>

          <Text style={profileStyles.textEmail}>
            Adress
            <Text style={profileStyles.textInfoEmail}>
              {"\n"}
              {addressFrom}
              {"\n"}
            </Text>
          </Text>

          <Text style={profileStyles.textEmail}>Poäng</Text>
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
    </View>
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
    paddingTop: 60
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
    height: 430
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
    top: 3
  },

  textFollowers: {
    fontSize: 20,
    color: "#228669"
  },

  settingInput: {
    paddingLeft: 10,
    height: 40,
    width: 250,
    borderColor: "white",
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: "flex-end",
    color: "#28A07D",
    backgroundColor: "white",
    top: 50
  },

  settingInputAddress: {
    paddingLeft: 10,
    height: 40,
    width: 250,
    borderColor: "white",
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: "flex-end",
    color: "#28A07D",
    backgroundColor: "white",
    top: 90
  },

  changeNameText: {
    fontSize: 20,
    paddingRight: 135,
    color: "white",
    top: 50
  },

  changeAddressText: {
    fontSize: 20,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    color: "white",
    top: 80
  },

  userInfoBlackText: {
    top: 140,
    left: 10,
    color: Colors.mediumGray
  },

  textEmail: {
    fontSize: 23,
    paddingLeft: 20,
    color: "#282828"
  },

  textInfoEmail: {
    fontSize: 20,
    color: "#BEBEBE"
  },

  whiteText: {
    color: "white",
    fontWeight: "500"
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
    backgroundColor: Colors.lightGreen,
    height: 40,
    width: 100,
    justifyContent: "center",
    alignItems: "center",
    top: 160
  },

  iconCan: {
    width: 32,
    height: 40
  },

  iconBottle: {
    width: 35,
    height: 42
  },

  iconMoney: {
    width: 40,
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
    paddingBottom: 0
  },

  starContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },

  recension: {
    top: 100,
    left: 30,
    flexDirection: "column",
    flex: 1,
    alignItems: "flex-start",
    color: Colors.mediumGray,
    height: 40
  },

  recensionText: {
    fontSize: 23
  },

  modalContentContainer: {
    flex: 1,
    flexDirection: "column",
    top: 40,
    justifyContent: "center",
    alignItems: "center"
  },

  popupBackground: {
    borderRadius: 10,
    backgroundColor: "#28A07D",
    height: "60%",
    width: "90%",
    //justifyContent: "center",
    alignItems: "center"
  },

  settingText: {
    fontSize: 26,
    color: "white",
    top: 30
  },

  closeModal: {
    top: 15,
    paddingRight: 5
  },

  saveButtonGreen: {
    borderRadius: 20,
    backgroundColor: "#228669",
    height: 40,
    width: 100,
    justifyContent: "center",
    alignItems: "center",
    top: 80
  },

  modalHeaderContainer: {
    flexDirection: "row",
    top: 8,
    left: 125
  }
});
