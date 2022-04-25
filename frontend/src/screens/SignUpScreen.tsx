import InputFieldList from "components/InputFieldList";
import TabBarIcon from "components/TabBarIcon";
import { ColorsEnum } from "constants/Colors";
import * as ImagePicker from 'expo-image-picker';
import { useApi, UserDataType } from "hooks/useApi";
import { UnauthenticatedUserNavigatorScreensEnum } from "navigation/UnauthenticatedUserNavigator";
import { useState } from "react";
import { Image, Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { HandleFieldChangeType, RootTabScreenProps } from "types";

const SignUpScreen = ({navigation}: RootTabScreenProps<UnauthenticatedUserNavigatorScreensEnum.SignUp>) => {
  const {register} = useApi()

  const [formData, setFormData] = useState<UserDataType>({
    date_of_birth: "", first_name: "", last_name: "", login: "", password: "", photo_uri: ""
  })

  //TODO create type for this
  const fields: { placeholder: string, key: keyof typeof formData }[] = [
    {
      placeholder: 'Имя',
      key: 'first_name'
    },
    {
      placeholder: 'Фамилия',
      key: 'last_name'
    },
    {
      placeholder: 'Логин',
      key: 'login'
    },
    {
      placeholder: 'Пароль',
      key: 'password'
    },
    {
      placeholder: 'Дата рождения: дд.мм.гггг',
      key: 'date_of_birth'
    },
  ]

  const handleFieldChange: HandleFieldChangeType<typeof formData> = (fieldKey, newValue) => {
    if (fieldKey === 'date_of_birth') {
      const oldValue = formData['date_of_birth']

      const oldValueLength = oldValue.length
      const newValueLength = newValue.length

      const isErasing = oldValue[oldValueLength - 1] === '.' && newValueLength === oldValueLength - 1

      if (!isErasing) {
        newValue = newValueLength === 2 || newValueLength === 5 ? newValue.concat('.') : newValue
      }
    }
    setFormData({...formData, [fieldKey]: newValue})
  }

  const handleLoadPhotoBtn = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      handleFieldChange('photo_uri', result.uri);
    }
  }

  const handleSignUpBtnPress = () => {
    console.log(formData)
    register(formData).then(res => console.log(res))
  }

  return (
    <KeyboardAvoidingView
      onTouchStart={Keyboard.dismiss}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <InputFieldList
        fieldStyles={styles.input}
        fields={fields.map(field => ({...field, value: formData[field.key]}))}
        handleFieldChange={handleFieldChange}
      />
      <View style={styles.profileImgContainer}>
        {
          formData['photo_uri'] ?
            <Pressable onPress={handleLoadPhotoBtn}>
              <Image
                source={{uri: formData['photo_uri']}}
                style={styles.profileImg}
              />
            </Pressable> :
            <View style={[styles.profileImg]}>
              <TabBarIcon
                name='camera'
                color={'white'}
                size={50}
                onPress={handleLoadPhotoBtn}
              />
            </View>
        }
      </View>
      <Pressable style={styles.btn} onPress={handleSignUpBtnPress}>
        <Text style={styles.btnText}>Зарегистрироваться</Text>
      </Pressable>
    </KeyboardAvoidingView>
  )
}

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 1,
    display: "flex",
  },
  input: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: ColorsEnum.white,
    marginVertical: 15,
    fontSize: 24,
    color: ColorsEnum.white,
    borderRadius: 5
  },
  profileImgContainer: {
    marginTop: 15,
    display: 'flex',
    alignItems: 'center'
  },
  profileImg: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
    height: 200,
    backgroundColor: '#D2CECE2B'
  },
  btn: {
    marginTop: 30,
    display: 'flex',
    alignItems: 'center',
    color: ColorsEnum.white,
    fontSize: 16
  },
  btnText: {
    color: ColorsEnum.white,
    fontSize: 24
  }
})
export default SignUpScreen;