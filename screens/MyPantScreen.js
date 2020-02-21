import * as firebase from "firebase";
import React, { useState, Component, useEffect } from "react";
import MyPantCard from "../components/MyPantCard";
import CreatePant from "../components/CreatePant";
import Colors from "../constants/Colors";
import "@firebase/firestore";
import Modal from "react-native-modal";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Alert,
  Text,
  TextInput,
  FlatList,
  Button
} from "react-native";
import globalStyles from "../AppStyles";

export default function MyPant() {
  //const [cansCount, setCanAmount] = useState(0);
  const [myPants, setMyPants] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [modalVisible, setModal] = useState(false);

  const user = firebase.auth().currentUser.uid;

  const dbh = firebase.firestore();
  const ref = dbh.collection("pants"); //reference to the pants collection

  toggleModal = () => {
    if (!modalVisible) {
      setModal(true);
    } else {
      setModal(false);
    }
  };
  //Get all the current users posted Pant
  useEffect(() => {
    return ref.onSnapshot(querySnapshot => {
      const list = [];
      querySnapshot.forEach(doc => {
        const { cans } = doc.data();
        list.push({
          id: doc.id,
          cans
        });
      });

      setMyPants(list);
    });
  }, []);

  //Add pant to the db
  /*
  async function addPant() {
    await ref.add({
      cans: cansCount,
      userId: user
    });
    setCanAmount("");
    setModal(!modalVisible);
  } */

  return (
    <View style={styles.MainContainer}>
      <Text>Min pant</Text>
      <View style={styles.container}>
        <FlatList
          data={myPants}
          renderItem={({ item }) => <MyPantCard cans={item.cans} />}
          keyExtractor={item => item.id}
        />
      </View>
      <CreatePant value={modalVisible} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    flexDirection: "row"
  },
  MainContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F5F5F5"
  },

  TouchableOpacityStyle: {
    position: "absolute",
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    bottom: 30
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16
  },
  title: {
    fontSize: 32
  },

  pantTextField: {
    height: 40,
    width: 300,
    borderColor: "gray",
    borderWidth: 1
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

  exitButton: {
    alignSelf: "flex-end",
    flex: 1
  },

  ModalContent: {
    padding: 20,
    backgroundColor: "white",
    flex: 1
  },

  ModalColor: {
    backgroundColor: "white",
    flex: 1,
    justifyContent: "center"
  },

  ModalHeaderContainer: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "flex-end"
  }
});
