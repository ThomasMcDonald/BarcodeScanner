import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './src/pages/Home'
import Header from './src/components/Header';

const Stack = createNativeStackNavigator();

export default function App(): JSX.Element {
  
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Barcode Scanner" 
          component={Home}
          options= {{
            header: (props) => <Header {...props}/>,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
