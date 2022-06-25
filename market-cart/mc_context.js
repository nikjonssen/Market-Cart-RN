import React, { useContext, useState, useEffect } from "react";
import * as NavigationBar from "expo-navigation-bar";
import { Keyboard } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import colors from "../constants/palette";

const AppContext = React.createContext();
const useGlobalContext = () => {
  return useContext(AppContext);
};

// initials
NavigationBar.setBackgroundColorAsync(colors.background);
NavigationBar.setButtonStyleAsync("light");

const AppProvider = ({ children }) => {
  // state
  const [errorMsg, setErrorMsg] = useState(null);
  const [didKeyboardShow, setKeyboardShow] = useState(false);
  const [edit, setEdit] = useState({});
  const [state, setState] = useState({
    listname: null,
    list: [],
    keys: [],
    show: false,
  });

  // Storage
  const storeData = async (key, value) => {
    try {
      let { list } = state;
      let data;
      if (key === "state" || key === "state2") {
        data = value;
      }
      if (key !== "state" && key !== "state2") {
        data = {
          id: Date.now(),
          name: key,
          list: list,
        };
      }
      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem(`${key}`, jsonValue);
    } catch (error) {
      setErrorMsg(`storeData error: ${error}`);
    }
  };

  const getData = async (key) => {
    try {
      let data = await AsyncStorage.getItem(`${key}`);
      if (data) {
        let parsed = await JSON.parse(data);
        return parsed;
      } else {
        return data;
      }
    } catch (error) {
      setErrorMsg(`getData error: ${error}`);
    }
  };

  const removeData = async (key) => {
    try {
      await AsyncStorage.removeItem(`${key}`);
      return;
    } catch (error) {
      setErrorMsg(`removeData error: ${error}`);
    }
  };

  const getAllKeys = async () => {
    try {
      let keys = await AsyncStorage.getAllKeys();
      let filtered = keys.filter((x) => {
        if (x !== "state" && x !== "state2") {
          return x;
        }
      });
      let state = { ...state, keys: filtered };
      setState(state);
      storeData("state", state);
    } catch (error) {
      setErrorMsg(`getAllKeys error: ${error}`);
    }
  };

  // Handlers
  const handleSave = async (name) => {
    try {
      if (name !== "state" && name !== "state2") {
        let state = { ...state, listname: name };
        setState(state);
        storeData("state", state);
        storeData(name);
        getAllKeys();
      }
    } catch (error) {
      setErrorMsg(`handleSave error: ${error}`);
    }
  };
  const handleLoad = async (key) => {
    try {
      let data = await getData(key);
      let state = { ...state, listname: data.name, list: data.list };
      setState(state);
      storeData("state", state);
    } catch (error) {
      setErrorMsg(`handleLoad error: ${error}`);
    }
  };
  const handleDelete = async (key) => {
    try {
      await removeData(key);
      getAllKeys();
    } catch (error) {
      setErrorMsg(`handleDelete  ${error}`);
    }
  };
  const handleAdd = async (data) => {
    try {
      let { list } = state;
      let item = { id: Date.now(), data: data, style: true };
      let newlist = [...list, item];
      let state = { ...state, list: newlist };
      setState(state);
      storeData("state", state);
    } catch (error) {
      setErrorMsg(`handleAdd error: ${error}`);
    }
  };
  const handlePatch = async (id, data, style) => {
    try {
      let { list } = state;
      const index = list.map((x) => x.id).indexOf(id);
      const patched = { id, data, style };
      list.splice(index, 1, patched);
      let state = { ...state, list: list };
      setState(state);
      storeData("state", state);
    } catch (error) {
      setErrorMsg(`handlePatch error: ${error}`);
    }
  };
  const handleRemove = async (id) => {
    try {
      let { list } = state;
      const newlist = list.filter((x) => x.id !== id);
      let state = { ...state, list: newlist };
      setState(state);
      storeData("state", state);
    } catch (error) {
      setErrorMsg(`handleRemove error: ${error}`);
    }
  };
  const handleClear = async () => {
    try {
      let state = { ...state, listname: null, list: [] };
      setState(state);
      storeData("state", state);
    } catch (error) {
      setErrorMsg(`handleClear error: ${error}`);
    }
  };
  const handleShowAdd = () => {
    let { show } = state;
    if (show) {
      let state = { ...state, show: false };
      setState(state);
      storeData("state", state);
    } else {
      let state = { ...state, show: true };
      setState(state);
      storeData("state", state);
    }
  };

  // navbar
  const setNavbar = () => {
    NavigationBar.setBackgroundColorAsync(colors.background);
    NavigationBar.setButtonStyleAsync("light");
  };

  // keyboard
  const keyboardDidShow = () => {
    setKeyboardShow(true);
  };
  const keyboardDidHide = () => {
    setKeyboardShow(false);
  };

  // init
  const initStateCheck = async () => {
    try {
      let data = await getData("state");
      if (data) {
        setState(data);
        storeData("state", data);
      }
    } catch (error) {
      setErrorMsg(`initCheck error: ${error}`);
    }
  };

  // useEffects
  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", keyboardDidShow);
    Keyboard.addListener("keyboardDidHide", keyboardDidHide);
    return () => {
      Keyboard.removeAllListeners("keyboardDidShow");
      Keyboard.removeAllListeners("keyboardDidHide");
    };
  }, []);

  useEffect(() => {
    setNavbar();
    initStateCheck();
  }, []);

  // useEffect(() => {
  //   if (errorMsg) {
  //     console.log(errorMsg);
  //   }
  // }, [errorMsg]);

  return (
    <AppContext.Provider
      value={{
        state,
        edit,
        didKeyboardShow,
        setEdit,
        handleSave,
        handleLoad,
        handleDelete,
        handleAdd,
        handleRemove,
        handleClear,
        handlePatch,
        handleClear,
        handleShowAdd,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider, useGlobalContext };
