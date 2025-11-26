import AppNavigation from '@/navigation/AppNavigation';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import './global.css';
import { ConfirmDialogProvider } from './src/components/common/ConfirmDialog';
const App = () => {
  return (
    <NavigationContainer>
      <ConfirmDialogProvider />
      <AppNavigation />
    </NavigationContainer>
  );
};

export default App;
