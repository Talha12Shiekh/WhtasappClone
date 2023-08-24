import { Animated, StyleSheet, Text, View } from "react-native";
import React, { useImperativeHandle, useState } from "react";
import { ACTIONS } from "./MessagesReducer";
import {
  ANSWER_BACKGROUND_COLOR,
  GREEN_MESSAGE_CLICKED_BACKGROUND,
  INACTIVE_TAB_WHITE_COLOR,
  MESSAGE_BACKGROUND_COLOR,
  TITLE_COLOR,
  generateSendTick,
} from "./WhatsappMainScreen";
import { Pressable } from "react-native";
import {
  MaterialIcons,
  FontAwesome5,
  MaterialCommunityIcons,
  Feather,
  FontAwesome,
  Fontisto,
  Entypo,
  Foundation,
} from "@expo/vector-icons";
import { useRef } from "react";

const SingleMessage = ({
  isEven,
  ColumnOrRow,
  index,
  dispatch,
  selected,
  keyOfMessage,
  deleteForEveryone,
  message,
  starred,
  hours,
  minutes,
  am_pm,
  messageStatus,
  starScaleAnimation
}) => {

  const messageRef = useRef(null);

  const cornerRef = useRef(null);

  let messageStyles = [styles.message];
  let questionMessageCornerStyles = [styles.messageCorner];
  let answerMessageCornerStyles = [styles.answermessageCorner];


  const changeMessageBackground = () => {
    if (index % 2 == 0) {
      messageStyles.push(styles.green_selected_background);
      questionMessageCornerStyles.push(styles.green_selected_background);
    } else {
      messageStyles.push(styles.grey_selected_background);
      answerMessageCornerStyles.push(styles.grey_selected_background);
    }
    messageRef.current.setNativeProps({
      style: messageStyles,
    });
    cornerRef.current.setNativeProps({
      style:
        index % 2 == 0
          ? questionMessageCornerStyles
          : answerMessageCornerStyles,
    });

    setTimeout(() => {
      if (index % 2 == 0) {
        messageStyles.push(styles.message_background_color);
        questionMessageCornerStyles.push(styles.message_background_color);
      } else {
        messageStyles.push(styles.answer_background_color);
        answerMessageCornerStyles.push(styles.answer_background_color);
      }
      messageRef.current.setNativeProps({
        style: messageStyles,
      });

      cornerRef.current.setNativeProps({
        style:
          index % 2 == 0
            ? questionMessageCornerStyles
            : answerMessageCornerStyles,
      });
    }, 2000);
  };

  return (
    <View>
      <Pressable
        onPress={() => {
          changeMessageBackground();
          dispatch({
            type: ACTIONS.DE_SELECT_MESSAGES,
            payload: {
              key: keyOfMessage,
              index,
            },
          });
        }}
        style={{
          backgroundColor: selected ? "#00800094" : "transparent",
          marginBottom: 10,
        }}
        onLongPress={() =>
          dispatch({
            type: ACTIONS.SELECT_MESSAGES,
            payload: {
              key: keyOfMessage,
            },
          })
        }
      >
        <View
          style={[
            styles.messagesContainer,
            { alignSelf: isEven ? "flex-end" : "flex-start" },
          ]}
        >
          <View
            style={isEven ? styles.messageCorner : styles.answermessageCorner}
            ref={cornerRef}
          />
          <View
            ref={messageRef}
            style={[
              styles.message,
              {
                transform: [{ translateX: isEven ? -20 : 20 }],
                flexDirection: "row",
                backgroundColor: isEven
                  ? MESSAGE_BACKGROUND_COLOR
                  : ANSWER_BACKGROUND_COLOR,
              },
            ]}
          >
            <View
              style={{
                flexDirection: ColumnOrRow,
              }}
            >
              {!deleteForEveryone ? (
                <View>
                  <Text
                    style={{
                      color: TITLE_COLOR,
                      fontSize: 15,
                      marginRight: 10,
                    }}
                  >
                    {message}
                  </Text>
                </View>
              ) : (
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ marginRight: 5 }}>
                    <MaterialIcons
                      name="block-flipped"
                      size={20}
                      color={INACTIVE_TAB_WHITE_COLOR}
                    />
                  </Text>
                  <Text
                    style={{
                      color: INACTIVE_TAB_WHITE_COLOR,
                      fontSize: 15,
                      marginRight: 10,
                      fontStyle: "italic",
                    }}
                  >
                    You deleted this message
                  </Text>
                </View>
              )}
              <View
                style={{
                  alignSelf: "flex-end",
                  marginTop: 5,
                  flexDirection: "row",
                }}
              >
                <View>
                  <Text style={{ color: TITLE_COLOR, fontSize: 10 }}>
                    <View
                      style={{
                        position: "absolute",
                        transform: [{ translateX: -35 }],
                      }}
                    ></View>
                    {starred && (
                      <>
                      <View style={{position:"absolute"}}>
                        <FontAwesome name="star" size={8} color={TITLE_COLOR} />
                        </View>
                        <Animated.View
                          style={{
                            position: "absolute",
                            transform: [
                              {
                                translateY: starScaleAnimation.interpolate({
                                  inputRange: [0, 1],
                                  outputRange: [0, -60],
                                }),
                              },
                              {
                                scale: starScaleAnimation.interpolate({
                                  inputRange: [0, 1],
                                  outputRange: [0, 3.4],
                                }),
                              },
                            ],
                            zIndex: 999999999,
                            opacity: starScaleAnimation.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0, 1],
                            })
                          }}
                        >
                          <FontAwesome
                            style={{ zIndex: 999999999 }}
                            name="star"
                            size={8}
                            color={"yellow"}
                          />
                        </Animated.View>
                      </>
                    )}{" "} 
                    {hours}:{minutes} {am_pm.toLowerCase()}{" "}
                  </Text>
                </View>
                {isEven && !deleteForEveryone && (
                  <View>
                    <Text style={{ color: TITLE_COLOR, fontSize: 10 }}>
                      {generateSendTick(messageStatus)}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

export default SingleMessage;

const styles = StyleSheet.create({
  message: {
    padding: 7,
    borderRadius: 10,
    marginBottom: 5,
  },
  messagesContainer: {
    flex: 1,
    flexWrap: "wrap",
    maxWidth: "80%",
  },
  messageCorner: {
    width: 15,
    height: 15,
    backgroundColor: MESSAGE_BACKGROUND_COLOR,
    position: "absolute",
    zIndex: -1,
    right: 12,
    borderBottomLeftRadius: 100,
    top: 0,
    transform: [{ rotate: "270deg" }],
  },
  answermessageCorner: {
    width: 15,
    height: 15,
    backgroundColor: ANSWER_BACKGROUND_COLOR,
    position: "absolute",
    zIndex: -1,
    left: 12,
    borderBottomLeftRadius: 100,
    top: 0,
  },
  singleLineOfMenu: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 20,
  },
  green_selected_background: {
    backgroundColor: GREEN_MESSAGE_CLICKED_BACKGROUND,
  },
  grey_selected_background: {
    backgroundColor: "black",
  },
  message_background_color: {
    backgroundColor: MESSAGE_BACKGROUND_COLOR,
  },
  answer_background_color: {
    backgroundColor: ANSWER_BACKGROUND_COLOR,
  },
});