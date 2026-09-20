import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { listCauses } from '../../api/causes';

export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [causes, setCauses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchCauses = useCallback(async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    setError('');

    try {
      const data = await listCauses();
      setCauses(data.causes || []);
    } catch (err) {
      setError(err.message || 'Unable to load causes.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchCauses();
  }, [fetchCauses]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      Alert.alert('Logout failed', error.message || 'Please try again.');
    }
  };

  const renderItem = ({ item }) => (
    <Pressable style={styles.card} onPress={() => navigation.navigate('CauseDetail', { causeId: item.id })}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardMeta}>{item.category || 'General'} • {item.status}</Text>
      <Text style={styles.cardDescription} numberOfLines={3}>{item.description || 'No description provided.'}</Text>
      <Text style={styles.cardAmount}>Raised: {Number(item.raised_amount || 0).toLocaleString()} / {Number(item.target_amount || 0).toLocaleString()}</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>Donor</Text>
          <Text style={styles.title}>Hi {user?.name || 'there'}</Text>
        </View>
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </View>

      <View style={styles.toolbar}>
        <Text style={styles.sectionTitle}>Browse causes</Text>
        <Pressable onPress={() => fetchCauses(true)}>
          <Text style={styles.refreshText}>Refresh</Text>
        </Pressable>
      </View>

      {loading && !refreshing ? (
        <View style={styles.centered}><Text>Loading causes…</Text></View>
      ) : error ? (
        <View style={styles.centered}><Text style={styles.errorText}>{error}</Text></View>
      ) : causes.length === 0 ? (
        <View style={styles.centered}><Text style={styles.emptyText}>No causes available right now.</Text></View>
      ) : (
        <FlatList
          data={causes}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchCauses(true); }} />}
        />
      )}

      <Pressable style={styles.donationsButton} onPress={() => navigation.navigate('MyDonations')}>
        <Text style={styles.donationsButtonText}>My Donations</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 14 },
  eyebrow: { fontSize: 12, color: '#475569', textTransform: 'uppercase', letterSpacing: 1 },
  title: { fontSize: 28, fontWeight: '700', color: '#0f172a' },
  logoutButton: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: '#e2e8f0' },
  logoutText: { fontWeight: '600', color: '#0f172a' },
  toolbar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 10 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#0f172a' },
  refreshText: { color: '#1d4ed8', fontWeight: '600' },
  listContent: { paddingHorizontal: 20, paddingBottom: 110 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a', marginBottom: 6 },
  cardMeta: { fontSize: 12, color: '#475569', marginBottom: 10 },
  cardDescription: { color: '#334155', marginBottom: 12 },
  cardAmount: { color: '#1d4ed8', fontWeight: '600' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  errorText: { color: '#b91c1c', fontWeight: '600', textAlign: 'center' },
  emptyText: { color: '#475569', textAlign: 'center' },
  donationsButton: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    backgroundColor: '#0f172a',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  donationsButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
