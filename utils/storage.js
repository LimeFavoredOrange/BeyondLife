import * as SecureStore from 'expo-secure-store';

// Store data
export const saveToSecureStore = async (key, value) => {
  try {
    await SecureStore.setItemAsync(key, value);
    console.log('Data saved successfully');
  } catch (error) {
    console.error('Error saving data', error);
  }
};

// Read data
export const getFromSecureStore = async (key) => {
  try {
    const value = await SecureStore.getItemAsync(key);
    if (value !== null) {
      console.log('Retrieved data:', value);
      return value;
    } else {
      console.log('No data found');
      return null;
    }
  } catch (error) {
    console.error('Error retrieving data', error);
  }
};

// Delete data
export const deleteFromSecureStore = async (key) => {
  try {
    await SecureStore.deleteItemAsync(key);
    console.log('Data deleted successfully');
  } catch (error) {
    console.error('Error deleting data', error);
  }
};
