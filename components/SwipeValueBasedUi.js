import React, { useState } from "react";
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  View
} from "react-native";

import { SwipeListView } from "react-native-swipe-list-view";

const rowSwipeAnimatedValues = {};
Array(40)
  .fill("")
  .forEach((_, i) => {
    rowSwipeAnimatedValues[`${i}`] = new Animated.Value(0);
  });

export default function SwipeValueBasedUi(props) {
  const [listData, setListData] = useState(props.pantList);

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = (rowMap, rowKey) => {
    closeRow(rowMap, rowKey);
    const newData = [...listData];
    const prevIndex = listData.findIndex(item => item.id === rowKey);
    newData.splice(prevIndex, 1);
    setListData(newData);
  };

  const onRowDidOpen = rowKey => {
    console.log("This row opened", rowKey);
  };

  const onSwipeValueChange = swipeData => {
    const { id, value } = swipeData;
    rowSwipeAnimatedValues[key].setValue(Math.abs(value));
  };

  const renderItem = data => (
    <TouchableHighlight
      onPress={() => console.log("You touched me")}
      style={styles.rowFront}
      underlayColor={"#AAA"}
    >
      <View>
        <Text>I am {data.item.cans} in a SwipeListView</Text>
      </View>
    </TouchableHighlight>
  );

  const renderHiddenItem = (data, rowMap) => (
    <View style={styles.rowBack}>
      <Text>Left</Text>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnLeft]}
        onPress={() => closeRow(rowMap, data.item.id)}
      >
        <Text style={styles.backTextWhite}>Close</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => deleteRow(rowMap, data.item.id)}
      >
        <Animated.View
          style={[
            styles.trash,
            {
              transform: [
                {
                  scale: rowSwipeAnimatedValues[data.item.id].interpolate({
                    inputRange: [45, 90],
                    outputRange: [0, 1],
                    extrapolate: "clamp"
                  })
                }
              ]
            }
          ]}
        ></Animated.View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <SwipeListView
        data={listData}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        leftOpenValue={75}
        rightOpenValue={-150}
        previewRowKey={"0"}
        previewOpenValue={-40}
        previewOpenDelay={3000}
        onRowDidOpen={onRowDidOpen}
        onSwipeValueChange={onSwipeValueChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1
  },
  backTextWhite: {
    color: "#FFF"
  },
  rowFront: {
    alignItems: "center",
    backgroundColor: "#CCC",
    borderBottomColor: "black",
    borderBottomWidth: 1,
    justifyContent: "center",
    height: 50
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: "#DDD",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15
  },
  backRightBtn: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: 75
  },
  backRightBtnLeft: {
    backgroundColor: "blue",
    right: 75
  },
  backRightBtnRight: {
    backgroundColor: "red",
    right: 0
  },
  trash: {
    height: 25,
    width: 25
  }
});
