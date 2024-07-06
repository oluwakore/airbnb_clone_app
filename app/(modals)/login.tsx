import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useWarmUpBrowser } from "../../hooks/useWarmUpBrowser";
import { defaultStyles } from "../../constants/Styles";
import Colors from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useOAuth } from "@clerk/clerk-expo";
import { router } from "expo-router";

enum Strategy {
  Google = "oauth_google",
  Apple = "oauth_apple",
  LinkedIn = "oauth_linkedin_oidc",
}

export default function login() {
  useWarmUpBrowser();

  const { startOAuthFlow: googleAuth } = useOAuth({ strategy: "oauth_google" });

  const { startOAuthFlow: appleAuth } = useOAuth({ strategy: "oauth_apple" });

  const { startOAuthFlow: linkedinAuth } = useOAuth({
    strategy: "oauth_linkedin_oidc",
  });

  const onSelectAuth = async (strategy: Strategy) => {
    const selectedAuth = {
      [Strategy.Google]: googleAuth,
      [Strategy.Apple]: appleAuth,
      [Strategy.LinkedIn]: linkedinAuth
    }[strategy]

    try {
      const { createdSessionId, setActive  } = await selectedAuth()
      // console.log(createdSessionId)
      if(createdSessionId) {
        setActive!({ session: createdSessionId })
        router.push('/(tabs)/')
      }
    } catch (error) {
      console.error('Something went wrong  with auth', error)
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        autoCapitalize="none"
        placeholder="Email"
        style={[
          defaultStyles.inputField,
          { marginBottom: 30, fontFamily: "mono_semi_bold" },
        ]}
      />
      <TouchableOpacity style={defaultStyles.btn}>
        <Text style={defaultStyles.btnText}>Continue</Text>
      </TouchableOpacity>

      <View style={styles.separatorView}>
        <View
          style={{
            flex: 1,
            borderBottomColor: "#000",
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        ></View>
        <Text style={styles.separator}>or</Text>
        <View
          style={{
            flex: 1,
            borderBottomColor: "#000",
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        ></View>
      </View>

      <View style={{ gap: 20 }}>
        <TouchableOpacity style={styles.btnOutline}>
          <Ionicons
            name="call-outline"
            size={24}
            style={defaultStyles.btnIcon}
          />
          <Text style={styles.btnOutlineText}>Continue with Phone</Text>
        </TouchableOpacity>
        <TouchableOpacity 
         onPress={() => onSelectAuth(Strategy.Google)}
        style={styles.btnOutline}>
          <Ionicons
            name="md-logo-google"
            size={24}
            style={defaultStyles.btnIcon}
          />
          <Text style={styles.btnOutlineText}>Continue with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onSelectAuth(Strategy.Apple)}
          style={styles.btnOutline}
        >
          <Ionicons
            name="md-logo-apple"
            size={24}
            style={defaultStyles.btnIcon}
          />
          <Text style={styles.btnOutlineText}>Continue with Apple</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onSelectAuth(Strategy.LinkedIn)}
          style={styles.btnOutline}
        >
          <Ionicons
            name="md-logo-linkedin"
            size={24}
            style={defaultStyles.btnIcon}
          />
          <Text style={styles.btnOutlineText}>Continue with LinkedIn</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffff",
    padding: 26,
  },
  separatorView: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginVertical: 30,
  },
  separator: {
    fontFamily: "mono_semi_bold",
    color: Colors.grey,
  },
  btnOutline: {
    backgroundColor: "#ffff",
    borderWidth: 1,
    borderColor: Colors.grey,
    height: 50,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  btnOutlineText: {
    color: "#000",
    fontSize: 16,
    fontFamily: "mono_semi_bold",
  },
});
