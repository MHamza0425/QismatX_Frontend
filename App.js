import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';

const BACKEND_URL = 'http://localhost:3000';

export default function App() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [txnId, setTxnId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('EasyPaisa');
  const [tokenCount, setTokenCount] = useState('1');
  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState('');

  const handlePaymentSubmit = async () => {
    if (!name || !phone || !address || !txnId) {
      Alert.alert("Required Fields", "Tamam tafseelat bharein.");
      return;
    }

    const count = parseInt(tokenCount, 10);
    if (isNaN(count) || count < 1 || count > 5) {
      Alert.alert("Limit Alert", "Aap ek waqt mein 1 se 5 tokens le sakte hain.");
      return;
    }

    setLoading(true);
    setResponseMsg('');

    try {
      const response = await fetch(`${BACKEND_URL}/api/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          address,
          txn_id: txnId,
          payment_method: paymentMethod,
          token_count: count
        })
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        setResponseMsg(`✅ ${data.message}\nPurchase ID: ${data.purchase_id}`);
        setTxnId('');
      } else {
        setResponseMsg(`❌ ${data.error}`);
      }
    } catch (err) {
      setLoading(false);
      setResponseMsg("❌ Backend Server Se Connection Fail Ho Gaya. Check karein backend chal raha hai.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🎲 Qismat X Lottery 🎲</Text>
      <Text style={styles.subtitle}>Enter details & purchase lifetime unique tokens</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput style={styles.input} placeholder="Ali Hassan" value={name} onChangeText={setName} />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput style={styles.input} placeholder="03001234567" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />

        <Text style={styles.label}>City / Address</Text>
        <TextInput style={styles.input} placeholder="Lahore, Pakistan" value={address} onChangeText={setAddress} />

        <Text style={styles.label}>Transaction ID (Txn ID)</Text>
        <TextInput style={styles.input} placeholder="TXN99887766" value={txnId} onChangeText={setTxnId} />

        <Text style={styles.label}>Payment Method</Text>
        <View style={styles.row}>
          <TouchableOpacity 
            style={[styles.chip, paymentMethod === 'EasyPaisa' && styles.activeChip]} 
            onPress={() => setPaymentMethod('EasyPaisa')}>
            <Text style={paymentMethod === 'EasyPaisa' ? styles.activeChipText : styles.chipText}>EasyPaisa</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.chip, paymentMethod === 'JazzCash' && styles.activeChip]} 
            onPress={() => setPaymentMethod('JazzCash')}>
            <Text style={paymentMethod === 'JazzCash' ? styles.activeChipText : styles.chipText}>JazzCash</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Tokens Quantity (Max 5 Tokens Total)</Text>
        <View style={styles.row}>
          {['1', '2', '3', '4', '5'].map((num) => (
            <TouchableOpacity 
              key={num}
              style={[styles.numChip, tokenCount === num && styles.activeChip]} 
              onPress={() => setTokenCount(num)}>
              <Text style={tokenCount === num ? styles.activeChipText : styles.chipText}>{num}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handlePaymentSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Submit Purchase Request</Text>}
        </TouchableOpacity>

        {responseMsg ? <Text style={styles.resultText}>{responseMsg}</Text> : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#0f172a', padding: 20, justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#f8fafc', textAlign: 'center', marginTop: 30 },
  subtitle: { fontSize: 13, color: '#94a3b8', textAlign: 'center', marginBottom: 20 },
  card: { backgroundColor: '#1e293b', padding: 20, borderRadius: 12, elevation: 5 },
  label: { color: '#cbd5e1', fontSize: 13, fontWeight: '600', marginTop: 12, marginBottom: 6 },
  input: { backgroundColor: '#334155', color: '#fff', padding: 12, borderRadius: 8, fontSize: 14 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  chip: { flex: 0.48, padding: 10, borderRadius: 8, backgroundColor: '#334155', alignItems: 'center' },
  numChip: { flex: 0.18, padding: 10, borderRadius: 8, backgroundColor: '#334155', alignItems: 'center' },
  activeChip: { backgroundColor: '#2563eb' },
  chipText: { color: '#94a3b8', fontWeight: 'bold' },
  activeChipText: { color: '#fff', fontWeight: 'bold' },
  button: { backgroundColor: '#16a34a', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  resultText: { marginTop: 15, textAlign: 'center', color: '#38bdf8', fontWeight: '500', fontSize: 13 }
});
