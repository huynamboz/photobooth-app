import { Modal, ModalProps, View } from 'react-native';
import React from 'react';

interface ModalBaseProps extends ModalProps {
  children?: React.ReactNode;
}

const ModalBase: React.FC<ModalBaseProps> = ({ children, visible, ...props }) => (
  <Modal visible={visible} transparent animationType="fade" {...props}>
    <View className="flex-1 px-4 justify-center items-center bg-gray-700/25 bg-opacity-50">
      <View className="bg-white p-5 rounded-lg w-full">{children}</View>
    </View>
  </Modal>
);

export { ModalBase };
