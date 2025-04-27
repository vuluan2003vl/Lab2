import React, { useState } from 'react';
import {
  Text,
  View,
  useColorScheme,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ScrollView,
  Switch,
} from 'react-native';

const CalcButton = ({ label, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => onPress(label)}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
};

export default function App() {
  const colorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(colorScheme === 'dark');
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

  const handlePress = (value) => {
    if (value === 'CLEAR') {
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
        setExpression(''); // Clear expression sau khi tính
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      <View style={styles.topBar}>
        <Switch value={isDark} onValueChange={setIsDark} />
      </View>

      {/* Khu vực hiển thị History + Expression */}
      <View style={styles.topArea}>
        {/* Lịch sử phép tính */}
        <ScrollView style={styles.historyContainer}>
          {history.map((item, index) => (
            <Text key={index} style={[styles.historyText, { color: isDark ? '#aaa' : '#555' }]}>
              {item.expr} = {item.result}
            </Text>
          ))}
        </ScrollView>

        {/* Biểu thức và kết quả hiện tại */}
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

      {/* Khu vực các nút bấm */}
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
});
