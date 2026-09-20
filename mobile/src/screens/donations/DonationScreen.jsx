import React, { useMemo, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { createDonation } from '../../api/donations';

export default function DonationScreen({ route, navigation }) {
  const { causeId, causeTitle } = route.params || {};
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const safeAmount = useMemo(() => {
    if (!amount.trim()) return NaN;
    const parsed = Number(amount);
    return Number.isFinite(parsed) ? parsed : NaN;
  }, [amount]);

  const validate = () => {
    if (!causeId) {
      setError('No cause selected.');
      return false;
    }
    if (!amount.trim()) {
      setError('Amount is required.');
      return false;
    }
    if (!Number.isFinite(safeAmount) || safeAmount <= 0) {
      setError('Please enter a positive number.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async () => {
    if (!validate() || submitting) return;
    setSubmitting(true);

    try {
      const response = await createDonation({
        cause_id: causeId,
        amount: safeAmount,
        type: 'one_time',
      });

      navigation.replace('DonationSuccess', {
        donation: response.donation,
        causeTitle,
      });
    } catch (err) {
      Alert.alert('Donation failed', err.message || 'The donation could not be submitted.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.kicker}>One-time donation</Text>
        <Text style={styles.title}>{causeTitle || 'Support this cause'}</Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            placeholder="5000"
            style={[styles.input, error ? styles.inputError : null]}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        <Pressable style={[styles.primaryButton, submitting && styles.buttonDisabled]} onPress={handleSubmit} disabled={submitting}>
          <Text style={styles.primaryButtonText}>{submitting ? 'Submitting…' : 'Submit donation'}</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.secondaryButtonText}>Back</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  kicker: { fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, color: '#475569', marginBottom: 8 },
  title: { fontSize: 28, fontWeight: '700', color: '#0f172a', marginBottom: 24 },
  fieldGroup: { marginBottom: 20 },
  label: { fontSize: 14, color: '#0f172a', marginBottom: 8, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  inputError: { borderColor: '#dc2626' },
  errorText: { color: '#dc2626', fontSize: 12, marginTop: 6 },
  primaryButton: {
    backgroundColor: '#1d4ed8',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonDisabled: { opacity: 0.7 },
  primaryButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  secondaryButton: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  secondaryButtonText: { color: '#0f172a', fontWeight: '600', fontSize: 16 },
});
