import React from 'react';
import {View, SafeAreaView} from 'react-native';
import Players from './pages/Players/Players';

export default function App() {
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Players />
      </View>
    </SafeAreaView>
  );
}
