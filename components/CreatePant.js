import * as firebase from "firebase";
import React, { useState, Component, useEffect } from "react";
import "@firebase/firestore";
import Modal from "react-native-modal";
import Colors from "../constants/Colors";
import globalStyles from "../AppStyles";
import cansIcon from "../assets/images/can.png";
import flaskIcon from "../assets/images/flask.png";
import locationIcon from "../assets/images/location-green.png";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Button,
  Image,
  Slider,
  TextInput,
  Alert
} from "react-native";
import { SelectLocationModal } from "./SelectLocationModal";
import { MaterialIcons } from "@expo/vector-icons";
import { PantStatus } from "../constants/PantStatus";

export default CreatePant = ({ setModal, modalStatus }) => {
  const [cansCount, setCanAmount] = useState(0);
  const [flaskCount, setFlaskAmount] = useState(0);
  const [location, setLocation] = useState(null);
  const [pantTextComment, onChangeText] = useState("");

  const user = firebase.auth().currentUser.uid;
  const dbh = firebase.firestore();
  const ref = dbh.collection("pants"); //reference to the pants collection

  async function addPant() {
    const pantMoney = cansCount + flaskCount * 2;

    await ref.add({
      cans: cansCount,
      flasks: flaskCount,
      location: location,
      userId: user,
      claimedUserId: "", //Will be updated when a user claims it
      estimatedValue: pantMoney,
      message: pantTextComment,
      status: PantStatus.Available
    });
    setCanAmount(0);
    setFlaskAmount(0);
    onChangeText("");
    setLocation(null);
    setModal(false);
  }

  return (
    <View style={styles.MainContainer}>
      <Modal style={styles.ModalColor} isVisible={modalStatus}>
        <View style={styles.ModalHeaderContainer}>
          <Text style={styles.modalText}>Skapa pant</Text>
          <Button
            style={styles.exitButton}
            title="x"
            onPress={() => setModal(false)}
          />
        </View>
        <View style={styles.ModalContent}>
          <View style={styles.canHeader}>
            <Image style={styles.cansIcon} source={cansIcon} />
            <Text style={styles.cansAmountText}>Antal burkar</Text>
          </View>
          <Slider
            value={0}
            step={1}
            maximumValue={300}
            minimumTrackTintColor={Colors.lightGreen}
            thumbTintColor={Colors.lightGreen}
            onValueChange={value => setCanAmount(value)}
          />
          <Text style={styles.cansSelectedText}>{cansCount}</Text>

          <View style={styles.canHeader}>
            <Image style={styles.cansIcon} source={flaskIcon} />
            <Text style={styles.cansAmountText}>Antal flaskor</Text>
          </View>
          <Slider
            value={0}
            step={1}
            maximumValue={300}
            minimumTrackTintColor={Colors.lightGreen}
            thumbTintColor={Colors.lightGreen}
            onValueChange={value => setFlaskAmount(value)}
          />
          <Text style={styles.cansSelectedText}>{flaskCount}</Text>

          <View style={styles.commentHeader}>
            <Text style={styles.cansAmountText}>Kommentar</Text>
            <View style={styles.inputFieldContainer}>
              <TextInput
                style={styles.textInput}
                onChangeText={text => onChangeText(text)}
                value={pantTextComment}
              />
            </View>
          </View>

          <View style={styles.canHeader}>
            <Image size={42} style={styles.cansIcon} source={locationIcon} />

            {location ? (
              <Text style={styles.chooseLocationText}>
                Longitude:{" "}
                <Text style={{ fontWeight: "bold" }}>
                  {location.longitude.toFixed(3)}
                </Text>
                {"\n"}
                Latitude:{" "}
                <Text style={{ fontWeight: "bold" }}>
                  {location.latitude.toFixed(3)}
                </Text>
              </Text>
            ) : (
              <SelectLocationModal onSelectLocation={setLocation} />
            )}
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={addPant}
          style={[globalStyles.lightGreenButton, styles.positionBottom]}
        >
          <Text style={globalStyles.buttonText}>Lets pant!</Text>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  MainContainer: {
    alignItems: "center",
    backgroundColor: "#F5F5F5"
  },
  textInput: {
    height: "100%",
    width: "100%",
    marginLeft: 40,
    color: "gray"
  },
  pantTextField: {
    height: 40,
    width: 300,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 20
  },

  cansIcon: {
    width: 40,
    height: 40,
    resizeMode: "contain"
  },

  modalText: {
    fontSize: 32,
    color: Colors.lightGreen,
    alignSelf: "flex-start",
    flex: 1,
    fontFamily: "fredoka-one"
  },

  FloatingButtonStyle: {
    resizeMode: "contain",
    width: 70,
    height: 70
  },

  positionBottom: {
    marginBottom: 30,
    marginHorizontal: 60
  },

  exitButton: {
    alignSelf: "flex-end",
    flex: 1
  },

  cansSelectedText: {
    fontWeight: "bold",
    color: Colors.lightGreen,
    marginBottom: 20,
    marginLeft: 5
  },
  cansAmountText: {
    color: Colors.grayText,
    marginLeft: 10,
    fontSize: 18
  },

  chooseLocationText: {
    color: Colors.grayText,
    marginLeft: 10,
    fontSize: 18
  },
  inputFieldContainer: {
    borderRadius: 25,
    height: 56,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderColor: Colors.xLightGray,
    borderWidth: 2.4,
    marginTop: 10
  },

  ModalContent: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "white",
    flex: 1
  },

  canHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10
  },

  commentHeader: {
    flexDirection: "column",
    marginBottom: 20
  },

  ModalColor: {
    backgroundColor: "white",
    justifyContent: "center",
    borderRadius: 20,
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start"
  },

  ModalHeaderContainer: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "flex-end"
  }
});
