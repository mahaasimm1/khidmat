import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { listMyDonations } from '../../api/donations';

export default function MyDonationsScreen({ navigation }) {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadDonations = useCallback(async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    setError('');
    try {
      const data = await listMyDonations();
      setDonations(data.donations || []);
    } catch (err) {
      setError(err.message || 'Unable to load donations.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDonations();
  }, [loadDonations]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.cause_title || 'Cause'}</Text>
      <Text style={styles.cardAmount}>{Number(item.amount || 0).toLocaleString()}</Text>
      <Text style={styles.cardMeta}>Type: {item.type}</Text>
      <Text style={styles.cardMeta}>Status: {item.status}</Text>
      <Text style={styles.cardMeta}>{new Date(item.created_at).toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Donations</Text>
        <Pressable onPress={() => navigation.navigate('Home')}>
          <Text style={styles.link}>Home</Text>
        </Pressable>
      </View>

      {loading && !refreshing ? (
        <View style={styles.centered}><Text>Loading donations…</Text></View>
      ) : error ? (
        <View style={styles.centered}><Text style={styles.errorText}>{error}</Text></View>
      ) : donations.length === 0 ? (
        <View style={styles.centered}><Text style={styles.emptyText}>No donations yet.</Text></View>
      ) : (
        <FlatList
          data={donations}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadDonations(true); }} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 48, paddingBottom: 16 },
  title: { fontSize: 28, fontWeight: '700', color: '#0f172a' },
  link: { color: '#1d4ed8', fontWeight: '700' },
  listContent: { padding: 20, paddingBottom: 40 },
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 14 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a', marginBottom: 8 },
  cardAmount: { fontSize: 22, fontWeight: '700', color: '#1d4ed8', marginBottom: 6 },
  cardMeta: { color: '#475569', marginBottom: 4 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  errorText: { color: '#b91c1c', fontWeight: '600', textAlign: 'center' },
  emptyText: { color: '#475569', textAlign: 'center' },
});
