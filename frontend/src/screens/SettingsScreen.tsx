import InputFieldList from "components/InputFieldList";
import { ColorsEnum } from "constants/Colors";
import { useApi, UserDataType } from "hooks/useApi";
import { useAuth } from "providers/AuthProvider";
import React, { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { HandleFieldChangeType } from "types";
import { getImageUri } from "utils/getImageUri";


const SettingsScreen = () => {
  const {updateUserData} = useApi()
  const {userData: {password, photo_uri, id}} = useAuth()

  const [formData, setFormData] = useState<Pick<UserDataType, 'photo_uri'> &
    { newPassword: string; newPasswordConfirm: string }>({
    newPassword: "",
    newPasswordConfirm: "",
    photo_uri: ""
  })

  const fields: { placeholder: string, key: keyof typeof formData }[] = [
    {
      placeholder: 'Новый пароль',
      key: 'newPassword'
    },
    {
      placeholder: 'Повторите новый пароль',
      key: 'newPasswordConfirm'
    },
  ]

  const handleFieldChange: HandleFieldChangeType<typeof formData> = (fieldKey, newValue) => {
    setFormData({...formData, [fieldKey]: newValue})
  }

  const handleLoadPhotoBtn = async () => {
    handleFieldChange('photo_uri', await getImageUri());
  }
  const isAllowedToChangePassword = formData['newPassword'] === formData['newPasswordConfirm'] &&
    formData["newPassword"] !== '' && formData['newPasswordConfirm'] !== ''

  const handleChangePasswordBtn = () => {
    if (isAllowedToChangePassword) updateUserData({password: formData['newPasswordConfirm']}, id)
  }

  return (
    <View style={styles.container}>
      <View style={styles.passwordContainer}>
        <InputFieldList
          fieldStyles={styles.input}
          fields={fields.map(field => ({...field, value: formData[field.key]}))}
          handleFieldChange={handleFieldChange}
        />
        <Pressable
          style={[
            styles.confirmPassBtn,
            {backgroundColor: isAllowedToChangePassword ? 'blue' : 'red'}
          ]}
          onPress={handleChangePasswordBtn}
        >
          <Text style={styles.text}>Сменить пароль</Text>
        </Pressable>
      </View>
      <Pressable style={styles.imgContainer} onPress={handleLoadPhotoBtn}>
        <Image
          source={{uri: formData['photo_uri'] || photo_uri}}
          style={{width: 200, height: 200}}
        />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  passwordContainer: {
    marginBottom: 30

  },
  imgContainer: {},
  input: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: ColorsEnum.white,
    marginVertical: 20,
    fontSize: 24,
    color: ColorsEnum.white,
    borderRadius: 5
  },
  confirmPassBtn: {
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'blue',
    borderRadius: 5
  },
  text: {
    color: ColorsEnum.white,
    fontSize: 24
  }
})

export default SettingsScreen