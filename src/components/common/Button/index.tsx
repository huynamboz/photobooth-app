import React, { ReactNode } from 'react';
import { Image, ImageSourcePropType, Text, TouchableOpacity, View } from 'react-native';

interface ButtonProps {
  icon?: ReactNode | ImageSourcePropType;
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
      <View className={`flex-row justify-center items-center ${contentClassName}`}>
        {icon && (
          <View className="mr-3">
            {React.isValidElement(icon) ? (
              icon
            ) : (
              <Image source={icon as ImageSourcePropType} className="w-6 h-6" />
            )}
          </View>
        )}
        <Text className={textStyle}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

export { Button, type ButtonProps };
