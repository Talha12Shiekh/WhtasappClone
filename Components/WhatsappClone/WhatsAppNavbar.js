import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Animated,
  TextInput,
  Alert,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Camera from "react-native-vector-icons/Feather";
import Search from "react-native-vector-icons/Fontisto";
import {
  ClosenavbarAnimation,
  RippleButton,
  navbarAnimation,
  showToast,
} from "./RippleButton";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Ionicons } from "react-native-vector-icons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";

import {
  TAB_BACKGROUND_COLOR,
  INACTIVE_TAB_WHITE_COLOR,
  TITLE_COLOR,
  CHAT_DATA_STATUS_COLOR,
  BADGE_BACKGROUND_COLOR,
} from "./WhatsappMainScreen";
import Menu from "./Menu";
import {
  useFocusEffect,
  useNavigation,
  useNavigationState,
  useRoute,
} from "@react-navigation/native";

const WhatsAppNavbar = ({
  selected,
  chats,
  setchats,
  opensearchBar,
  setopensearchBar,
  FileredChats,
  setFileredChats,
  archived,
  setarchived,
  handleChatsMaking,
  currentTabIndex,
  setactiveRoute,
  activeRoute
}) => {

   // *! DATA OF THE BADGES IN THE NAVBAR

  const badgesData = [
    { badgeText: "Unread", badgeIcons: "mark-chat-unread", size: 22, key: 1 },
    { badgeText: "Photos", badgeIcons: "photo", size: 22, key: 2 },
    { badgeText: "Videos", badgeIcons: "videocam", size: 22, key: 3 },
    { badgeText: "Links", badgeIcons: "insert-link", size: 25, key: 4 },
    { badgeText: "GIFs", badgeIcons: "gif", size: 25, key: 5 },
    { badgeText: "Audio", badgeIcons: "audiotrack", size: 25, key: 6 },
    { badgeText: "Documents", badgeIcons: "contact-page", size: 20, key: 7 },
    { badgeText: "Polls", badgeIcons: "poll", size: 20, key: 8 },
  ];

  const navigation = useNavigation();

  let screens = ["Community", "Chats", "Status", "Calls"];

  useFocusEffect(() => {
    setactiveRoute(screens[currentTabIndex]);
  });

  
  const SelectChatMenuAnimation = useRef(new Animated.Value(0)).current;

  const selectedNavbarAnimation = useRef(new Animated.Value(0)).current;

  const searchNavbarAnimation = useRef(new Animated.Value(0)).current;

  const MenuAnimation = useRef(new Animated.Value(0)).current;

  const inputRef = useRef(null);

  const [value, setValue] = useState("");

  const [MenuData,setMenuData] = useState();

  const [readed,setreaded] = useState(false);

  const [isAllselected,setisAllselected] = useState(false);

  // *! DATA OF THE MENU OF THE CHAT WHEN WE SELECT IT

  const SelectedChatMenuData = [
    { text: "Add chat shortcut", onPress: () => {}, key: 1 },
    { text: "View contact", onPress: () => {}, key: 2 },
    { text: `Mark as ${readed ? "read" : "Unread"}`, onPress: () => {
      let newChats = [...chats];
     const readedChats = newChats.map(chat => {
      if(chat.selected){
        setreaded(!readed);
        return {
          ...chat,
          readed:!chat.readed
        }
      }
      return chat;
     });
     setchats(readedChats)
    }, key: 3 },
   !isAllselected ? { text: "Select all", onPress: () => {
      const newChats = [...chats];
      const selectedAllChats = newChats.map(chat => {
        setisAllselected(true);
        if(chat){
          return {
            ...chat,
            selected:true
          }
        }
      })
      setchats(selectedAllChats);
    }, key: 4 } : { text: "UnSelect all", onPress: () => {
      const newChats = [...chats];
      const selectedAllChats = newChats.map(chat => {
        setisAllselected(false);
        if(chat){
          return {
            ...chat,
            selected:false
          }
        }
      })
      setchats(selectedAllChats);
    }, key: 5 }
  ];

  // *! FUNCTION TO NAVIGATE TO PROFILE

  function navigateToProfile() {
    navigation.navigate("Profile",{handleChatsMaking});
  }

  // *! USE EFFECT FOR SELECTINNG THE CHAT AND MAKING THE NAVBAR OPENING ANIMATION


  useEffect(() => {
    if (selected) {
      navbarAnimation(selectedNavbarAnimation);
    } else {
      ClosenavbarAnimation(selectedNavbarAnimation);
    }
  }, [selected]);

  // *! USE EFFECT FOR OPENING THE SEARCH BAR

  useEffect(() => {
    if (opensearchBar) {
      navbarAnimation(searchNavbarAnimation);
    } else {
      ClosenavbarAnimation(searchNavbarAnimation);
    }
  }, [opensearchBar]);

  const handleOpenSearchBar = () => {
    setopensearchBar(!opensearchBar);
  };

  const searchNavbarInterpolation = searchNavbarAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [410, 0],
  });

  const searchNavbarStyles = {
    transform: [{ translateX: searchNavbarInterpolation }],
  };

  // *! FUNCTION TO PIN THE CHAT

  const handlePinChat = useCallback(() => {
    let newchats = [...chats];
    let pinnedchats = newchats.filter(chat => chat.pinned);
    if(pinnedchats.length < 3){

    const selectedChats = newchats.map((chat) => {
      if (chat.selected) {
        return {
          ...chat,
          pinned: !chat.pinned,
        };
      }
      return chat;
    });
    setchats(selectedChats);
    setFileredChats(selectedChats);

    showToast("Pinned chat");
  }else{
    showToast("You can not pin more than 3 chats");
  }

  }, [setchats, chats, setFileredChats]);

  // *! FUNCTION TO SHOW THE MENU

  const handleShowMenu = () => {
    Animated.timing(MenuAnimation, {
      toValue: 1,
      duration: 1100,
      useNativeDriver: true,
    }).start();
  };

  // *! FUNCTON TO MUTE THE CHAT

  const handleMuteChat = useCallback(() => {
    let newchats = [...chats];
    const selectedChats = newchats.map((chat) => {
      if (chat.selected) {
        return {
          ...chat,
          muted: !chat.muted,
        };
      }
      return chat;
    });
    setchats(selectedChats);
    setFileredChats(selectedChats);
    showToast("Chat muted");
  }, [chats, setchats, setFileredChats]);

  // *! FUNCTION TO ARCHIVE THE CHAT

  const hanldeArchieveChat = useCallback(() => {
    let newchats = [...chats];
    const archievedChats = newchats.filter((chat) => chat.selected);
    const unSelectChatsArchived = archievedChats.map((chat) => {
      if (chat.selected) {
        return { ...chat, selected: false };
      }
      return chat;
    });

    setarchived((prevArchived) => [...prevArchived, ...unSelectChatsArchived]);

    const deletedChats = newchats.filter((chat) => {
      if (chat.selected) {
        return;
      }
      return chat;
    });
    setchats(deletedChats);
    setFileredChats(deletedChats);
    showToast(
      `${unSelectChatsArchived.length} chat${
        unSelectChatsArchived.length > 1 ? "s" : ""
      } Archieved`
    );
  }, [chats, setchats, setFileredChats, setarchived]);

  // *! FUNCTION TO FILTER THE CHAT

  const handleFilterChats = useCallback(
    (vlue) => {
      setValue(vlue);

      if (vlue == "") {
        setchats(FileredChats);
      } else {
        const FilteredItems = chats.filter((chat) => {
          return chat.name.toLowerCase().includes(vlue.toLowerCase());
        });

        if (FilteredItems.length > 0) {
          setchats(FilteredItems);
        } else {
          setchats(FileredChats);
        }
      }
    },
    [setchats, chats]
  );

  // *! FUNCTION TO GET THE SELECTED CHAT NUMBER

  const selectedChats = chats.filter((chat) => {
    if (chat.selected) {
      return chat;
    }
  });

  // *! FUNCTION TO DELETE THE CHAT

  const handleDeleteChat = useCallback(() => {
    let newchats = [...chats];
    const deletedChats = newchats.filter((chat) => {
      if (chat.selected) {
        return;
      }
      return chat;
    });

    Alert.alert(
      `Delete ${selectedChats.length > 1 ? selectedChats.length : "this"} Chat${
        selectedChats.length > 1 ? "s" : ""
      } ?`,
      "Messages will only be removed from this device and your devices on the newer versions of the Whatsapp",
      [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            setchats(deletedChats);
            setFileredChats(deletedChats);
          },
        },
      ],
      { cancelable: true }
    );

    showToast("Chat deleted");
  }, [chats, setchats, setFileredChats]);

  // *! FUNCTION TO OPEN THE SELECTEDCHAT MENU

  const hanldeOpenMenu = () => {
    Animated.timing(SelectChatMenuAnimation, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  };

  // *! FUNCTION TO CHANGE THE DATA OF THE MENU

  useEffect(() => {
    
    if (activeRoute == "Community") {
      const UpDatedData = [{ text: "Settings", onPress: () => {}, key: 10 }];
      setMenuData(UpDatedData);

    } else {

      const UpDatedData = [
        {
          text: "New Group",
          onPress: () => {
            navigateToProfile();
          },
          key: 1,
        },
        {
          text: "New Broadcast",
          onPress: () => {
            navigateToProfile();
          },
          key: 2,
        },
        {
          text: "Linked devices",
          onPress: () => {
            navigation.navigate("LinkedDevices");
          },
          key: 3,
        },
        { text: "Starred Messages", onPress: () => {}, key: 4 },
        { text: "Settings", onPress: () => {}, key: 5 },
      ];

      setMenuData(UpDatedData);
    }
  }, [activeRoute]);

  return (
    <>
      <StatusBar backgroundColor={TAB_BACKGROUND_COLOR} />

      <Animated.View
        style={[
          styles.searchNavbarContainer,
          { backgroundColor: TAB_BACKGROUND_COLOR },
          searchNavbarStyles,
        ]}
      >
        <View style={[styles.input_and_arrow_container]}>
          <RippleButton onPress={() => setopensearchBar(false)}>
            <AntDesign
              name="arrowleft"
              size={26}
              color={CHAT_DATA_STATUS_COLOR}
            />
          </RippleButton>
          <TextInput
            style={styles.Searchinput}
            placeholder="Search..."
            placeholderTextColor={CHAT_DATA_STATUS_COLOR}
            value={value}
            onChangeText={handleFilterChats}
            ref={inputRef}
          />
        </View>
        <View style={[styles.badgesContainer]}>
          {badgesData.map((badge) => {
            return (
              <View
                key={badge.key}
                style={[
                  styles.badge,
                  { backgroundColor: BADGE_BACKGROUND_COLOR, height: 35 },
                ]}
              >
                <View style={styles.badgeIcon}>
                  <MaterialIcons
                    name={badge.badgeIcons}
                    size={badge.size}
                    color={CHAT_DATA_STATUS_COLOR}
                  />
                </View>
                <View style={styles.badgeText}>
                  <Text style={{ color: TITLE_COLOR }}>{badge.badgeText}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </Animated.View>
      <Menu
        animation={SelectChatMenuAnimation}
        menuData={SelectedChatMenuData}
      />
      <Animated.View
        style={[
          styles.selectedChatNavbar,
          {
            backgroundColor: TAB_BACKGROUND_COLOR,
            transform: [{ scaleX: selectedNavbarAnimation }],
          },
        ]}
      >
        <View style={styles.chatsCountContainer}>
          <RippleButton
            onPress={() => ClosenavbarAnimation(selectedNavbarAnimation)}
          >
            <AntDesign name="arrowleft" size={24} color={TITLE_COLOR} />
          </RippleButton>
          <Text style={{ fontSize: 20, marginLeft: 15, color: TITLE_COLOR }}>
            {selectedChats.length}
          </Text>
        </View>
        <View
          style={[
            styles.iconContainer,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <RippleButton onPress={handlePinChat}>
            <AntDesign name="pushpin" size={21} color={TITLE_COLOR} />
          </RippleButton>
          <RippleButton onPress={handleDeleteChat}>
            <MaterialIcons name="delete" size={21} color={TITLE_COLOR} />
          </RippleButton>
          <RippleButton onPress={handleMuteChat}>
            <FontAwesome5 name="volume-mute" size={21} color={TITLE_COLOR} />
          </RippleButton>
          <RippleButton onPress={hanldeArchieveChat}>
            <Ionicons name="archive-outline" size={21} color={TITLE_COLOR} />
          </RippleButton>
          <RippleButton onPress={hanldeOpenMenu}>
            <SimpleLineIcons
              name="options-vertical"
              color={TITLE_COLOR}
              size={18}
            />
          </RippleButton>
        </View>
      </Animated.View>

      <Menu animation={MenuAnimation} menuData={MenuData} />
      <View
        style={[
          styles.navbarContainer,
          { backgroundColor: TAB_BACKGROUND_COLOR },
        ]}
      >
        <View style={styles.textContainer}>
          <Text
            style={[styles.whatsappText, { color: INACTIVE_TAB_WHITE_COLOR }]}
          >
            WhatsApp
          </Text>
        </View>
        <View style={styles.iconContainer}>
          <RippleButton onPress={() => navigation.navigate("Camera")}>
            <Camera name="camera" color={INACTIVE_TAB_WHITE_COLOR} size={18} />
          </RippleButton>
          {activeRoute == "Community" ? null : <RippleButton onPress={handleOpenSearchBar}>
            <Search name="search" color={INACTIVE_TAB_WHITE_COLOR} size={18} />
          </RippleButton>}
          <RippleButton onPress={handleShowMenu}>
            <SimpleLineIcons
              name="options-vertical"
              color={INACTIVE_TAB_WHITE_COLOR}
              size={18}
            />
          </RippleButton>
        </View>
      </View>
    </>
  );
};

export default WhatsAppNavbar;

const styles = StyleSheet.create({
  navbarContainer: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  whatsappText: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 8,
  },
  Searchinput: {
    padding: 10,
    flex: 1,
    paddingLeft: 10,
    borderWidth: 0,
    height: 50,
    fontSize: 17,
    marginLeft: 10,
    color: "white",
  },
  badgesContainer: {
    flex: 1,
    marginHorizontal: 14,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  searchNavbarContainer: {
    height: 210,
    width: "100%",
    position: "absolute",
    zIndex: 55555,
    justifyContent: "space-between",
    backgroundColor: "red",
  },
  input_and_arrow_container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
  badge: {
    flexDirection: "row",
    width: "30%",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 8,
    borderRadius: 20,
  },
  selectedChatNavbar: {
    width: "100%",
    height: "8%",
    backgroundColor: "red",
    position: "absolute",
    zIndex: 2222,
    flexDirection: "row",
    justifyContent: "space-between",
    top: 0,
  },
  iconContainer: {
    flexDirection: "row",
    gap: 2,
  },
  chatsCountContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  menuContainer: {},
  hide: {
    transform: [{ scale: 0 }],
  },
  show: {
    transform: [{ scale: 1 }],
  },
});
