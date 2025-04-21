import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

const CalcButton = ({ label, onPress, style, textStyle }) => {
  return (
    <TouchableOpacity style={style} onPress={onPress}>
      <Text style={textStyle}>{label}</Text>
    </TouchableOpacity>
  );
};

export default CalcButton;
