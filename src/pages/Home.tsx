import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { ModalExample } from '@/components/common/Modal/ModalExample';
import { Text } from '@/components/common/Text';
import { useConfirmDialogStore } from '@/store/confirmDialogStore';
import React, { useState } from 'react';
import { View } from 'react-native';

const HomeScreen = () => {
  const { confirm } = useConfirmDialogStore();

  const handleDelete = async () => {
    const confirmValue = await confirm({
      title: 'Are you sure you want to delete this item?',
    });
    console.log(confirmValue);
  };

  const [text, setText] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  function onCloseModal(data: any) {
    console.log(data);
    setIsVisible(false);
  }
  return (
    <View className="p-5">
      <Text className="text-3xl font-default">This is Default Font</Text>
      <Text className="text-3xl font-bold">This is Bold</Text>
      <Text className="text-3xl font-light">This is Light</Text>
      <Text className="text-3xl font-thin">This is Thin</Text>
      <Input label="Name" value={text} onChangeText={setText} />
      <Button text="Delete" onPress={handleDelete} />
      <Button text="Show Modal" className="mt-4" onPress={() => setIsVisible(true)} />
      <ModalExample isVisible={isVisible} onClose={onCloseModal} />
    </View>
  );
};

export default HomeScreen;
