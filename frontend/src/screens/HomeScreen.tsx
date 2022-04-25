import { ColorsEnum } from "constants/Colors";
import { AuthContext, useAuth } from "providers/AuthProvider";
import React, { useContext } from "react";
import { Image, StyleSheet, Text, View } from "react-native";


const HomeScreen = () => {
  const {userData} = useAuth()
  const {first_name, last_name, date_of_birth, photo_uri} = userData
  const textFields = [first_name, last_name, date_of_birth]

  if (!userData) {
    return <Text style={styles.text}>...Loading</Text>
  }

  return (
    <View style={styles.container}>
      {textFields.map((textField, idx) => {
        return (
          <Text key={idx} style={styles.text}>{textField}</Text>
        )
      })}
      <Image source={{uri: photo_uri}} style={{width: 200, height: 200}}/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    marginBottom: 15,
    color: ColorsEnum.white
  }
})

export default HomeScreen