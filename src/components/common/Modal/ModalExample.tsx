import { View } from 'react-native';
import { ModalBase } from './ModalBase';
import React from 'react';
import { Button } from '../Button';
import { Input } from '../Input';

//Should use https://github.com/react-native-modal/react-native-modal?tab=readme-ov-file ???
interface ExampleModalProps {
  isVisible: boolean;
  onClose: (data?: any) => void;
}

const ModalExample: React.FC<ExampleModalProps> = ({ isVisible, onClose }) => {
  return (
    <ModalBase transparent animationType="fade" onRequestClose={onClose} visible={isVisible}>
      <View className="flex-col justify-end mt-5">
        <Input label="Name" value="" onChangeText={() => {}} />

        <Button
          text="Đóng"
          onPress={() => onClose({ data: 'data' })}
          className="border rounded-xl w-full h-fit"
          contentClassName="justify-start"
        />
      </View>
    </ModalBase>
  );
};

// export { ExampleModal };

export { ModalExample };
