import React, { useEffect, useState } from 'react';
import { Alert, ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getCause } from '../../api/causes';

export default function CauseDetailScreen({ route, navigation }) {
  const { causeId } = route.params || {};
  const [cause, setCause] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadCause() {
      if (!causeId) {
        setError('Cause not found.');
        setLoading(false);
        return;
      }

      try {
        const data = await getCause(causeId);
        setCause(data.cause);
      } catch (err) {
        setError(err.message || 'Unable to load this cause.');
      } finally {
        setLoading(false);
      }
    }

    loadCause();
  }, [causeId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1d4ed8" />
        <Text style={styles.loadingText}>Loading cause…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.primaryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.primaryButtonText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const handleDonate = () => {
    if (!cause?.id) {
      Alert.alert('Error', 'This cause is unavailable for donation.');
      return;
    }
    navigation.navigate('Donation', { causeId: cause.id, causeTitle: cause.title });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.kicker}>Cause</Text>
      <Text style={styles.title}>{cause?.title || 'Cause'}</Text>
      <Text style={styles.meta}>{cause?.category || 'General'} • {cause?.status || 'active'}</Text>
      <Text style={styles.description}>{cause?.description || 'No description provided.'}</Text>

      <View style={styles.dataBox}>
        <Text style={styles.dataRow}><Text style={styles.label}>Raised:</Text> {Number(cause?.raised_amount || 0).toLocaleString()}</Text>
        <Text style={styles.dataRow}><Text style={styles.label}>Target:</Text> {Number(cause?.target_amount || 0).toLocaleString()}</Text>
        <Text style={styles.dataRow}><Text style={styles.label}>Zakat eligible:</Text> {cause?.zakat_eligible ? 'Yes' : 'No'}</Text>
      </View>

      <Pressable style={styles.primaryButton} onPress={handleDonate}>
        <Text style={styles.primaryButtonText}>Donate one-time</Text>
      </Pressable>
      <Pressable style={styles.secondaryButton} onPress={() => navigation.goBack()}>
        <Text style={styles.secondaryButtonText}>Back to causes</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 24, paddingTop: 40 },
  centered: { flex: 1, backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center', padding: 24 },
  kicker: { fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, color: '#475569', marginBottom: 8 },
  title: { fontSize: 30, fontWeight: '700', color: '#0f172a', marginBottom: 8 },
  meta: { fontSize: 14, color: '#475569', marginBottom: 18 },
  description: { fontSize: 16, lineHeight: 24, color: '#334155', marginBottom: 20 },
  dataBox: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 20 },
  dataRow: { fontSize: 15, color: '#0f172a', marginBottom: 8 },
  label: { fontWeight: '700' },
  primaryButton: { backgroundColor: '#1d4ed8', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  primaryButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  secondaryButton: { borderWidth: 1, borderColor: '#cbd5e1', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  secondaryButtonText: { color: '#0f172a', fontWeight: '600', fontSize: 16 },
  loadingText: { marginTop: 12, color: '#475569' },
  errorText: { color: '#b91c1c', fontSize: 16, marginBottom: 16, textAlign: 'center' },
});
