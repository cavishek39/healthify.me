import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const analytics = () => {
  return (
    <View style={styles.container}>
      <Text>analytics</Text>
    </View>
  )
}

export default analytics

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
