import React, { ReactNode } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface ButtonProps {
  icon?: ReactNode;
  text: string;
  variant?: keyof typeof buttonVariants;
  color?: string;
  className?: string;
  classNameText?: string;
  textFont?: string;
  onPress?: () => void;
  disabled?: boolean;
  contentClassName?: string;
}

const buttonVariants = {
  primary: {
    base: 'rounded px-4 py-3',
    text: 'font-medium text-white',
    defaultColor: 'bg-primary',
  },
  text: {
    base: 'rounded bg-transparent px-4 py-3',
    text: 'font-medium text-gray-800',
    defaultColor: '',
  },
  link: {
    base: 'rounded bg-transparent',
    text: 'font-medium text-blue-500 underline',
    defaultColor: '',
  },
  secondary: {
    base: 'rounded px-4 py-3',
    text: 'font-medium text-secondary-foreground',
    defaultColor: 'bg-secondary',
  },
  destructive: {
    base: 'rounded px-4 py-3',
    text: 'font-medium text-white',
    defaultColor: 'bg-destructive',
  },
};

const Button = ({
  icon,
  text,
  variant = 'primary',
  color,
  className = '',
  classNameText = '',
  textFont = 'text-base',
  onPress,
  disabled = false,
  contentClassName = '',
}: ButtonProps) => {
  const variantStyle = buttonVariants[variant] || buttonVariants.primary;

  const buttonStyle = [
    variantStyle.defaultColor ? `${variantStyle.defaultColor} ` : '',
    color ? `bg-${color} ` : '',
    variantStyle.base,
    disabled ? 'opacity-50 ' : '',
    className,
  ].join(' ');

  const textStyle = [variantStyle.text, textFont, classNameText].join(' ');

  return (
    <TouchableOpacity
      className={buttonStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View className={`flex-row gap-2 justify-center items-center ${contentClassName}`}>
        <Text className={textStyle}>{text}</Text>
        {icon ? icon : null}
      </View>
    </TouchableOpacity>
  );
};

export { Button, type ButtonProps };
