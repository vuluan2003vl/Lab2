import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  useColorScheme,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import CalcButton from './components/CalcButton';

export default function App() {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState(colorScheme || 'light');
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [sound, setSound] = useState();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('./assets/button-press.mp3')
    );
    setSound(sound);
    await sound.playAsync();
  };

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const handlePress = (value) => {
    playSound();
    if (value === 'C') {
      setExpression('');
      setResult('');
    } else if (value === 'DEL') {
      setExpression(expression.slice(0, -1));
    } else if (value === '=') {
      try {
        const evalResult = eval(expression);
        setResult(evalResult.toString());
      } catch (e) {
        setResult('Error');
      }
    } else {
      setExpression(expression + value);
    }
  };

  const buttons = [
    ['C', '/', '*', 'DEL'],
    ['7', '8', '9', '-'],
    ['4', '5', '6', '+'],
    ['1', '2', '3', '='],
    ['0', '.'],
  ];

  const isDark = theme === 'dark';

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#121212' : '#ffffff',
      padding: 16,
    },
    topBar: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginBottom: 16,
    },
    displayContainer: {
      minHeight: 100,
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
      marginBottom: 16,
    },
    expressionText: {
      fontSize: 32,
      color: isDark ? '#ffffff' : '#000000',
    },
    resultText: {
      fontSize: 24,
      color: '#888',
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    button: {
      flex: 1,
      backgroundColor: isDark ? '#333' : '#eee',
      margin: 5,
      paddingVertical: 20,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonText: {
      fontSize: 24,
      color: isDark ? '#fff' : '#000',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={toggleTheme}>
          <Ionicons
            name={theme === 'light' ? 'moon' : 'sunny'}
            size={32}
            color={isDark ? '#fff' : '#000'}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.displayContainer}>
        <Text style={styles.expressionText}>{expression}</Text>
        <Text style={styles.resultText}>{result}</Text>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {buttons.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.buttonRow}>
            {row.map((button) => (
              <CalcButton
                key={button}
                label={button}
                onPress={() => handlePress(button)}
                style={styles.button}
                textStyle={styles.buttonText}
              />
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
