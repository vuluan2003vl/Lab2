import React, { useState } from 'react';
import {
  Text,
  View,
  useColorScheme,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const buttonGap = 8; // tăng khoảng cách nút cho đẹp hơn
const numColumns = 4;
const numRows = 6;
const buttonSizeWidth = (width - buttonGap * (numColumns + 1)) / numColumns;
const buttonSizeHeight = (height * 0.5 - buttonGap * (numRows + 1)) / numRows;
const buttonSize = Math.min(buttonSizeWidth, buttonSizeHeight);

const CalcButton = ({ label, onPress }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  return (
    <TouchableOpacity
      style={[
        styles.button,
        isDark ? styles.buttonDark : styles.buttonLight
      ]}
      onPress={() => onPress(label)}
    >
      <Text
        style={[
          styles.buttonText,
          isDark ? styles.textLight : styles.textDark
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default function App() {
  const systemTheme = useColorScheme();
  const [theme, setTheme] = useState(systemTheme || 'light');
  const isDark = theme === 'dark';
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState([]);

  const buttons = [
    ['(', ')', 'C', 'DEL'],
    ['7', '8', '9', '/'],
    ['4', '5', '6', '*'],
    ['1', '2', '3', '-'],
    ['0', '.', '%', '+'],
    ['√', '^', '=', '']
  ];

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handlePress = (value) => {
    if (value === 'C') {
      setExpression('');
      setResult('');
    } else if (value === 'DEL') {
      setExpression(expression.slice(0, -1));
      setResult('');
    } else if (value === '=') {
      try {
        let expr = expression
          .replace(/%/g, '/100')
          .replace(/√(\d+(\.\d+)?)/g, 'Math.sqrt($1)')
          .replace(/(\d+(\.\d+)?)\^(\d+(\.\d+)?)/g, 'Math.pow($1,$3)');
        const evalResult = eval(expr);
        setResult(evalResult.toString());
        setHistory([{ expr: expression, result: evalResult.toString() }, ...history]);
      } catch {
        setResult('Error');
      }
    } else {
      setExpression(expression + value);
    }
  };

  const renderHistory = ({ item }) => (
    <View style={styles.historyItem}>
      <Text
        style={[
          styles.historyText,
          isDark ? styles.textLight : styles.textDark
        ]}
      >
        {item.expr} = {item.result}
      </Text>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, isDark ? styles.darkBackground : styles.lightBackground]}
    >
      <View style={styles.topBar}>
        <TouchableOpacity onPress={toggleTheme}>
          <Ionicons
            name={theme === 'light' ? 'moon' : 'sunny'}
            size={28}
            color={isDark ? '#fff' : '#000'}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={history}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderHistory}
        style={styles.historyContainer}
      />

      <View style={styles.displayContainer}>
        <Text
          style={[styles.expressionText, isDark ? styles.textLight : styles.textDark]}
        >
          {expression}
        </Text>
        <Text
          style={[styles.resultText, isDark ? styles.textLight : styles.textDark]}
        >
          {result}
        </Text>
      </View>

      <View style={styles.buttonsContainer}>
        {buttons.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.buttonRow}>
            {row.map((btn, idx) =>
              btn !== '' ? (
                <CalcButton key={btn} label={btn} onPress={handlePress} />
              ) : (
                <View key={`empty-${idx}`} style={styles.buttonEmpty} />
              )
            )}
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  lightBackground: { backgroundColor: '#ffffff' },
  darkBackground: { backgroundColor: '#121212' },
  topBar: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 8 },
  historyContainer: { maxHeight: 80, marginBottom: 8 },
  historyItem: { paddingVertical: 2 },
  historyText: { fontSize: 14 },
  displayContainer: { minHeight: 80, alignItems: 'flex-end', justifyContent: 'center', marginBottom: 8 },
  expressionText: { fontSize: 26 },
  resultText: { fontSize: 20, color: '#888888' },
  buttonsContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    paddingHorizontal: buttonGap, 
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: buttonGap,
  },
  button: {
    width: buttonSize,
    height: buttonSize,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonLight: { backgroundColor: '#eeeeee' },
  buttonDark: { backgroundColor: '#333333' },
  buttonText: { fontSize: 22 },
  textLight: { color: '#ffffff' },
  textDark: { color: '#000000' },
  buttonEmpty: { 
    width: buttonSize, 
    height: buttonSize,
  }
});
