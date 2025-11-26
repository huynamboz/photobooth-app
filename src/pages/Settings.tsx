import { Button } from '@/components/common/Button';
import { useAuthStore } from '@/store';
import React, { useCallback, useMemo } from 'react';
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  useColorScheme,
} from 'react-native';
import {
  Bell,
  ChevronRight,
  Shield,
  SlidersHorizontal,
  User as UserIcon,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const settingsOptions = [
  {
    id: 'profile',
    label: 'Thông tin cá nhân',
    description: 'Quản lý hồ sơ và thông tin liên hệ',
    icon: UserIcon,
  },
  {
    id: 'security',
    label: 'Bảo mật',
    description: 'Đổi mật khẩu và bật xác thực',
    icon: Shield,
  },
  {
    id: 'notifications',
    label: 'Thông báo',
    description: 'Điều chỉnh thông báo bạn nhận được',
    icon: Bell,
  },
  {
    id: 'preferences',
    label: 'Tuỳ chỉnh',
    description: 'Chủ đề, ngôn ngữ và các tuỳ chọn khác',
    icon: SlidersHorizontal,
  },
] as const;

const SettingsScreen = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isLoading = useAuthStore((state) => state.isLoading);
  const colorScheme = useColorScheme();

  const avatarFallback = useMemo(() => {
    const source = user?.name ?? user?.email ?? 'User';
    return source.charAt(0).toUpperCase();
  }, [user?.email, user?.name]);

  const handleOptionPress = useCallback((label: string) => {
    Alert.alert(label, 'Tính năng sẽ sớm được cập nhật.');
  }, []);

  const handleLogout = useCallback(async () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
      { text: 'Huỷ', style: 'cancel' },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: () => logout(),
      },
    ]);
  }, [logout]);

  const cardStyle: ViewStyle = {
    shadowColor: '#000',
    shadowOpacity: colorScheme === 'dark' ? 0 : 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 px-6 py-6">
          <View
            className="bg-white dark:bg-card rounded-2xl border border-border px-4 py-5"
            style={cardStyle}
          >
            <View className="flex-row items-center">
              <View className="w-16 h-16 rounded-full bg-primary/10 justify-center items-center mr-4">
                <Text className="text-primary text-2xl font-bold">{avatarFallback}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-xl font-semibold text-foreground">
                  {user?.name || 'Người dùng'}
                </Text>
                <Text className="text-gray-500 mt-1">{user?.email || 'Chưa có email'}</Text>
              </View>
            </View>
          </View>

          <View
            className="mt-8 bg-white dark:bg-card rounded-2xl border border-border"
            style={cardStyle}
          >
            {settingsOptions.map((option, index) => (
              <TouchableOpacity
                key={option.id}
                className={`flex-row items-center px-4 py-4 ${index !== settingsOptions.length - 1 ? 'border-b border-border' : ''}`}
                onPress={() => handleOptionPress(option.label)}
                activeOpacity={0.7}
              >
                <View className="w-10 h-10 rounded-full bg-secondary justify-center items-center mr-3">
                  <option.icon color="#16a34a" size={20} strokeWidth={2} />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-foreground">{option.label}</Text>
                  <Text className="text-sm text-muted-foreground mt-1">{option.description}</Text>
                </View>
                <ChevronRight color="#9ca3af" size={18} strokeWidth={2} />
              </TouchableOpacity>
            ))}
          </View>

          <Button
            text="Đăng xuất"
            variant="destructive"
            className="w-full mt-8"
            onPress={handleLogout}
            disabled={isLoading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
