import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Button, FlatList } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getDatabase, push, ref, remove, onValue } from 'firebase/database';

export default function App() {

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDBiOhDQ7Romv2fNJoYHvm_cu64UEsLJVU",
    authDomain: "t12-shoppinglist.firebaseapp.com",
    databaseURL: "https://t12-shoppinglist-default-rtdb.firebaseio.com",
    projectId: "t12-shoppinglist",
    storageBucket: "t12-shoppinglist.appspot.com",
    messagingSenderId: "390469027382",
    appId: "1:390469027382:web:8861fa3485935306d2ba97"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);

  const [amount, setAmount] = useState('');
  const [product, setProduct] = useState('');
  const [items, setItems] = useState([]);

  // Save item
  const saveItem = () => {
    push(
      ref(database, 'items/'),
      { 'product': product,
      'amount': amount,
     });
  }

  // Delete item

  const deleteItem = (id) => {
    console.log(id) // id is undefined :(
    remove(
      ref(database, 'items/' + id)
      )
    }

    // Listen to changes in firebase
    useEffect(() => {
      const itemsRef = ref(database, 'items/');
      onValue(itemsRef, (snapshot) => {
        const data = snapshot.val();
        setItems(Object.values(data));
      })
    }, []);

  const listSeparator = () => {
    return (
      <View
        style={{
          height: 5,
          width: "80%",
          backgroundColor: "#fff",
          marginLeft: "10%"
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder='Product' style={{ marginTop: 30, fontSize: 18, width: 200, borderColor: 'gray', borderWidth: 1 }}
        onChangeText={(amount) => setAmount(amount)}
        value={amount} />
      <TextInput placeholder='Amount' style={{ marginTop: 5, marginBottom: 5, fontSize: 18, width: 200, borderColor: 'gray', borderWidth: 1 }}
        onChangeText={(product) => setProduct(product)}
        value={product} />
      <Button onPress={saveItem} title="Save" />
      <Text style={{ marginTop: 30, fontSize: 20 }}>Shopping list</Text>
      <FlatList
        style={{ marginLeft: "5%" }}
        // How to get item id?
        keyExtractor={item => item.id.toString()} 
        //keyExtractor={(item, index) => index.toString()}
        //keyExtractor={item => item.id}
        renderItem={({ item }) => <View style={styles.listcontainer}><Text style={{ fontSize: 18 }}>{item.amount}, {item.product}</Text>
          <Text style={{ fontSize: 18, color: '#0000ff' }} onPress={(e) => deleteItem(item.id)}> delete</Text></View>}
        data={items}
        ItemSeparatorComponent={listSeparator}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listcontainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center'
  },
});