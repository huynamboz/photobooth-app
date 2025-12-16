import { photoboothService, type UserSessionResponse } from '@/services';
import { AppStackParamList } from '@/types/navigation.type';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { History as HistoryIcon } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type HistoryNavigationProp = NativeStackNavigationProp<AppStackParamList>;

const HistoryScreen = () => {
  const navigation = useNavigation<HistoryNavigationProp>();
  const [sessions, setSessions] = useState<UserSessionResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchSessions = useCallback(async (pageNum: number = 1, refresh: boolean = false) => {
    try {
      const response = await photoboothService.getUserSessions({
        page: pageNum,
        limit: 20,
      });

      if (refresh || pageNum === 1) {
        setSessions(response.data);
      } else {
        setSessions((prev) => [...prev, ...response.data]);
      }

      setHasMore(response.meta.page < response.meta.totalPages);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      setPage(1);
      fetchSessions(1, true);
    }, [fetchSessions]),
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    fetchSessions(1, true);
  }, [fetchSessions]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchSessions(nextPage, false);
    }
  }, [isLoading, hasMore, page, fetchSessions]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Hoàn thành';
      case 'active':
        return 'Đang chụp';
      case 'pending':
        return 'Chờ bắt đầu';
      case 'cancelled':
        return 'Đã hủy';
      case 'expired':
        return 'Hết hạn';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSessionPress = (sessionId: string) => {
    navigation.navigate('SessionDetail', { sessionId });
  };

  const renderSessionItem = ({ item }: { item: UserSessionResponse }) => (
    <TouchableOpacity
      onPress={() => handleSessionPress(item.id)}
      className="bg-white rounded-2xl border border-[#e5e7eb] p-4 mb-3 shadow-sm"
    >
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-1">
          <Text className="text-base font-semibold text-foreground">
            {item.photobooth?.name || 'Photobooth'}
          </Text>
          <Text className="text-sm text-muted-foreground mt-1">{formatDate(item.createdAt)}</Text>
        </View>
        <View className={`rounded-full px-3 py-1 ${getStatusColor(item.status)}`}>
          <Text className="text-xs font-semibold">{getStatusText(item.status)}</Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-gray-200">
        <View className="flex-row items-center">
          <HistoryIcon color="#6b7280" size={16} />
          <Text className="text-sm text-muted-foreground ml-2">
            {item.photoCount} / {item.maxPhotos} ảnh
          </Text>
        </View>
        {item.startedAt && (
          <Text className="text-xs text-muted-foreground">
            Bắt đầu:{' '}
            {new Date(item.startedAt).toLocaleTimeString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  if (isLoading && sessions.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#16a34a" />
          <Text className="text-sm text-muted-foreground mt-4">Đang tải lịch sử...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 py-4 border-b border-border">
        <Text className="text-2xl font-bold text-foreground">Lịch sử chụp hình</Text>
        <Text className="text-sm text-muted-foreground mt-1">
          Xem lại các phiên chụp hình của bạn
        </Text>
      </View>

      {sessions.length === 0 ? (
        <View className="flex-1 justify-center items-center px-6">
          <HistoryIcon color="#9ca3af" size={64} />
          <Text className="text-lg font-semibold text-muted-foreground mt-4">
            Chưa có lịch sử chụp hình
          </Text>
          <Text className="text-sm text-muted-foreground text-center mt-2">
            Bắt đầu chụp hình để xem lịch sử tại đây
          </Text>
        </View>
      ) : (
        <FlatList
          data={sessions}
          renderItem={renderSessionItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 20, paddingTop: 12 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#16a34a" />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            hasMore ? (
              <View className="py-4 items-center">
                <ActivityIndicator size="small" color="#16a34a" />
              </View>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
};

export default HistoryScreen;
