import { Button } from '@/components/common/Button';
import { useConfirmDialogStore } from '@/store/confirmDialogStore';
import React from 'react';
import { View } from 'react-native';
import { Text } from '../Text';

export function ConfirmDialogProvider() {
  const { isOpen, confirmResolver, dialogData } = useConfirmDialogStore();

  if (!isOpen) return null;

  return (
    <View className="absolute inset-0 z-50 flex items-center justify-center w-full h-full px-5 bg-gray-900/50">
      <View className="w-full p-5 bg-white rounded-lg max-w-[400px]">
        <Text className="text-xl font-bold">{dialogData.title || 'Confirm'}</Text>
        <Text className="mt-2">{dialogData.message}</Text>
        <View className="flex-row justify-end gap-4 mt-5">
          {/* Confirm button */}
          <Button
            text={dialogData.confirmButton?.text || 'Confirm'}
            variant={dialogData.confirmButton?.variant || 'destructive'}
            onPress={() => confirmResolver && confirmResolver(true)}
          />

          {/* Cancel button */}
          {!dialogData.isOnlyConfirm && (
            <Button
              text={dialogData.cancelButton?.text || 'Cancel'}
              variant={dialogData.cancelButton?.variant || 'secondary'}
              onPress={() => confirmResolver && confirmResolver(false)}
              className="mr-2"
            />
          )}
        </View>
      </View>
    </View>
  );
}
