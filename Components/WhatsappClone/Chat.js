import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableNativeFeedback,
  Image,
  Modal,
  ToastAndroid,
  TouchableWithoutFeedback,
  Pressable,
} from "react-native";
import React, { useRef, useState } from "react";
import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
} from "react-native-vector-icons";
import {
  ACTIVE_TAB_GREEN_COLOR,
  CHAT_BACKROUND_COLOR,
  CHAT_DATA_STATUS_COLOR,
  CHAT_HEIGHT,
  CHAT_SELECTION_BACKGROUND,
  INACTIVE_TAB_WHITE_COLOR,
  TAB_BACKGROUND_COLOR,
  TAB_PRESS_ACTIVE_WHITE_COLOR,
  TITLE_COLOR,
} from "./WhatsappMainScreen";
import {
  ModelComponent,
  PopupIconsRippleButton,
  showToast,
} from "./RippleButton";

const Chat = (item) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalphoto, setmodalphoto] = useState("");
  const [modalName, setmodalName] = useState("");
  const { RightPlaceRenderThing, LeftPlaceRenderThing } = item;
  let aboutlimit = item.NotshowChatMakingDate
    ? "Lorem ipsum dolor sit amet"
    : "Lorem ipsum dolor sit amet talha call";

  function handleOpenDpModel(photo, name) {
    setModalVisible(true);
    setmodalphoto(photo);
    setmodalName(name);
  }

  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  function initDescription() {
    if (item.type == "chat") {
      return (
        <Text style={[styles.info, { color: CHAT_DATA_STATUS_COLOR }]}>
          {item.about.length > aboutlimit.length
            ? item.about.slice(0, aboutlimit.length - 1) + "..."
            : item.about}
        </Text>
      );
    } else if (item.type == "call") {
      const { date, month, hour, minutes, am_pm } = item;
      return (
        <View style={{ flexDirection: "row" }}>
          <View style={{ transform: [{ translateY: 5 }] }}>
            <Feather
              name="arrow-down-left"
              size={24}
              color={item.arrowColor ? ACTIVE_TAB_GREEN_COLOR : "red"}
            />
          </View>
          <View>
            <Text
              style={{
                color: CHAT_DATA_STATUS_COLOR,
                marginTop: 5,
                marginLeft: 15,
                fontSize: 15,
              }}
            >
              {date} {months[month]} , {hour}:{minutes} {am_pm.toLowerCase()}
            </Text>
          </View>
        </View>
      );
    }
  }

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <ModelComponent
          name={modalName}
          photo={modalphoto}
          onPress={() => setModalVisible(!modalVisible)}
        />
      </Modal>
      <TouchableNativeFeedback
        onPress={item.onPress}
        onLongPress={item.onLongPress}
        background={TouchableNativeFeedback.Ripple(
          TAB_PRESS_ACTIVE_WHITE_COLOR,
          false
        )}
      >
        <View
          style={[
            styles.chat,
            {
              backgroundColor: item.selected
                ? CHAT_SELECTION_BACKGROUND
                : CHAT_BACKROUND_COLOR,
              height: CHAT_HEIGHT,
            },
          ]}
        >
          <LeftPlaceRenderThing handleOpenDpModel={handleOpenDpModel} />
          <View>
            <View style={[styles.textContainer, { flex: 1 }]}>
              <View style={{ width: "60%" }}>
                <Text style={[styles.title, { color: TITLE_COLOR }]}>
                  {item.name.length > 18 ? item.name.slice(0, 19) : item.name}
                </Text>
              </View>
              <View style={{ width: "30%", marginRight: 10 }}>
                {item.NotshowChatMakingDate && (
                  <Text
                    style={[styles.time, { color: CHAT_DATA_STATUS_COLOR }]}
                  >
                    {item.date < 10 ? "0" + item.date : item.date}/
                    {item.month < 10 ? "0" + item.month : item.month}/
                    {item.year}
                  </Text>
                )}
              </View>
            </View>
            <View style={[styles.textContainer]}>
              <View
                style={{
                  width: item.NotshowChatMakingDate ? "70%" : "80%",
                  marginBottom: -5,
                }}
              >
                {initDescription()}
              </View>
              <RightPlaceRenderThing />
            </View>
          </View>
        </View>
      </TouchableNativeFeedback>
    </>
  );
};

export default Chat;

const styles = StyleSheet.create({
  chat: {
    padding: 20,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  chatsContainer: {
    flex: 1,
  },
  textContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 20,
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
  },
  time: {
    fontWeight: "500",
    fontSize: 12,
  },
});
