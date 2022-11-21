import { ActivityIndicator } from 'react-native';
import LoginScreen from './screens/Login';
import RegistryScreen from './screens/Registry';
import HomeScreen from './screens/Home';
import DialogScreen from './screens/Dialog';
import HistoryMessageScreen from './screens/HistoryMessage';
import FileSharedScreen from './screens/FileShared';
import { RootSiblingParent } from 'react-native-root-siblings';
import AuthScreen from './screens/Auth';
import { NavigationContainer } from '@react-navigation/native';
import Stack from './utilities/Navigate'
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <RootSiblingParent>
      <StatusBar style="dark" />
      {/* <ActivityIndicator size="large" color="blue" animating={indicator} /> */}
      <NavigationContainer>
        <Stack.Navigator initialRouteName={"Auth"} screenOptions={{
          headerShown: false, gestureEnabled: false
        }}>
          <Stack.Screen name="Auth" component={AuthScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Registry" component={RegistryScreen} />
          <Stack.Screen name="Dialog" component={DialogScreen} />
          <Stack.Screen name="HistoryMessage" component={HistoryMessageScreen} />
          <Stack.Screen name="FileShared" component={FileSharedScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </RootSiblingParent >
  );
}