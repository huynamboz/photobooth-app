import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  disabled?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  leftComponent,
  rightComponent,
  disabled,
}) => {
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  return (
    <View className="w-full mb-4">
      {label && <Text className="text-gray-700 font-medium mb-1">{label}</Text>}
      <View
        className={`flex-row h-fit items-center border rounded-lg px-3 py-3 bg-white ${
          disabled ? 'border-gray-300 bg-gray-100' : 'border-gray-300'
        }`}
      >
        {leftComponent && <View className="mr-2">{leftComponent}</View>}
        <TextInput
          className="flex-1 text-gray-900"
          placeholder={placeholder}
          value={value}
          style={{ fontSize: 16, color: disabled ? '#A0A0A0' : '#000' }}
          onChangeText={onChangeText}
          secureTextEntry={isSecure}
          keyboardType={keyboardType}
          editable={!disabled}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setIsSecure(!isSecure)} disabled={disabled}>
            {isSecure ? (
              <Icon name="eye-slash" size={20} color={disabled ? '#A0A0A0' : '#000'} />
            ) : (
              <Icon name="eye" size={20} color={disabled ? '#A0A0A0' : '#000'} />
            )}
          </TouchableOpacity>
        )}
        {rightComponent && <View className="ml-2">{rightComponent}</View>}
      </View>
    </View>
  );
};

export { Input, type InputProps };
