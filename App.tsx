import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "./screens/HomeScreen";
import InsightsScreen from "./screens/InsightsScreen";
import ToDoScreen from "./screens/ToDoScreen";
import UpgradeScreen from "./screens/UpgradeScreen";
import { UserProvider } from "./contexts/UserContext";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Today" component={HomeScreen} />
          <Tab.Screen name="Insights" component={InsightsScreen} />
          <Tab.Screen name="To Do" component={ToDoScreen} />
          <Tab.Screen name="Upgrade" component={UpgradeScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}
