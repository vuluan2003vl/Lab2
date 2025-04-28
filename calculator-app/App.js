import React, { useState } from 'react';
import {
  Text,
  View,
  useColorScheme,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Audio } from 'expo-av';
import { Entypo } from '@expo/vector-icons'; // Thư viện icon Entypo

const CalcButton = ({ label, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={() => onPress(label)}>
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
};

export default function App() {
  const colorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(colorScheme === 'dark');
  const [backgroundColor, setBackgroundColor] = useState(isDark ? '#000' : '#fff');
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState([]);

  const buttons = [
    ['(', ')', 'DEL', 'C'],
    ['7', '8', '9', '*'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '√', '/'],
    ['^', '%', '=', ''],
  ];

  const playSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('./assets/click.mp3')
      );
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  };

  const handlePress = async (value) => {
    await playSound();
    if (value === 'CLEAR' || value === 'C') {
      setExpression('');
      setResult('');
    } else if (value === 'DEL') {
      setExpression(expression.slice(0, -1));
      tryEval(expression.slice(0, -1));
    } else if (value === '=') {
      try {
        let expr = convertExpression(expression);
        const evalResult = eval(expr);
        setResult(evalResult.toString());
        setHistory([{ expr: expression, result: evalResult.toString() }, ...history]);
        setExpression('');
      } catch {
        setResult('Error');
      }
    } else {
      const newExpr = expression + value;
      setExpression(newExpr);
      tryEval(newExpr);
    }
  };

  const convertExpression = (expr) => {
    return expr
      .replace(/%/g, '/100')
      .replace(/√(\d+(\.\d+)?)/g, 'Math.sqrt($1)')
      .replace(/(\d+(\.\d+)?)\^(\d+(\.\d+)?)/g, 'Math.pow($1,$3)');
  };

  const tryEval = (expr) => {
    try {
      const converted = convertExpression(expr);
      const evalResult = eval(converted);
      setResult(evalResult.toString());
    } catch {
      setResult('');
    }
  };

  const toggleTheme = () => {
    if (isDark) {
      setBackgroundColor('#ffffff'); // Chuyển về sáng
      setIsDark(false);
    } else {
      setBackgroundColor('#000000'); // Chuyển về tối
      setIsDark(true);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      {/* Top Bar đổi theme */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={toggleTheme}>
          {isDark ? (
            <Entypo name="light-up" size={28} color="#f5c518" style={styles.iconStyle} />
          ) : (
            <Entypo name="moon" size={28} color="#999" style={styles.iconStyle} />
          )}
        </TouchableOpacity>
      </View>

      {/* Hiển thị lịch sử và biểu thức */}
      <View style={styles.topArea}>
        <ScrollView style={styles.historyContainer}>
          {history.map((item, index) => (
            <Text key={index} style={[styles.historyText, { color: isDark ? '#aaa' : '#555' }]}>
              {item.expr} = {item.result}
            </Text>
          ))}
        </ScrollView>

        <View style={styles.expressionContainer}>
          <Text numberOfLines={1} style={[styles.expressionText, { color: isDark ? '#fff' : '#000' }]}>
            {expression || '0'}
          </Text>
          {result !== '' && (
            <Text style={[styles.resultText, { color: isDark ? '#0f0' : '#333' }]}>
              {result}
            </Text>
          )}
        </View>
      </View>

      {/* Các nút bấm */}
      <View style={styles.buttonsContainer}>
        {buttons.map((row, rowIndex) => (
          <View style={styles.buttonRow} key={rowIndex}>
            {row.map((btn, idx) =>
              btn !== '' ? (
                <CalcButton key={btn} label={btn} onPress={handlePress} />
              ) : (
                <View key={`empty-${idx}`} style={styles.button} />
              )
            )}
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  topBar: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 8 },
  topArea: {
    flexDirection: 'row',
    marginBottom: 12,
    minHeight: 100,
    alignItems: 'flex-end',
    
  },
  historyContainer: {
    flex: 1,
    maxHeight: 100,
  },
  historyText: {
    fontSize: 14,
    marginBottom: 2,
  },
  expressionContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  expressionText: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  resultText: {
    fontSize: 20,
    marginTop: 4,
  },
  buttonsContainer: { flex: 1, justifyContent: 'center' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  button: {
    backgroundColor: '#d3d3d3',
    flex: 1,
    marginHorizontal: 6,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
  },
  buttonText: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  iconStyle: {
    marginHorizontal: 8,
  },
});
