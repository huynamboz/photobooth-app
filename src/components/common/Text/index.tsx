import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';

interface TextProps extends RNTextProps {
  className?: string;
}

const Text = React.forwardRef<RNText, TextProps>(({ style, className, ...props }, ref) => (
  <RNText ref={ref} style={[style]} className={`font-default ${className || ''}`} {...props} />
));

Text.displayName = 'Text';

export { Text };
