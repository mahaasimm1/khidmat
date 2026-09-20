import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function DonationSuccessScreen({ route, navigation }) {
  const { donation, causeTitle } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.badge}>Donation received</Text>
      <Text style={styles.title}>Thank you for your support.</Text>
      <Text style={styles.summary}>You donated {Number(donation?.amount || 0).toLocaleString()} to {causeTitle || 'this cause'}.</Text>
      <Text style={styles.meta}>Type: {donation?.type || 'one_time'}</Text>
      <Text style={styles.meta}>Status: {donation?.status || 'completed'}</Text>

      <Pressable style={styles.primaryButton} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.primaryButtonText}>Back to causes</Text>
      </Pressable>

      <Pressable style={styles.secondaryButton} onPress={() => navigation.navigate('MyDonations')}>
        <Text style={styles.secondaryButtonText}>View My Donations</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', justifyContent: 'center', padding: 28 },
  badge: { fontSize: 12, textTransform: 'uppercase', color: '#166534', letterSpacing: 1, fontWeight: '700', marginBottom: 12 },
  title: { fontSize: 30, fontWeight: '700', color: '#0f172a', marginBottom: 14 },
  summary: { fontSize: 18, color: '#334155', marginBottom: 18 },
  meta: { fontSize: 15, color: '#475569', marginBottom: 8 },
  primaryButton: { backgroundColor: '#1d4ed8', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 28 },
  primaryButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  secondaryButton: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 12 },
  secondaryButtonText: { color: '#0f172a', fontWeight: '600', fontSize: 16 },
});
