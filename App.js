import React, { useReducer, useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Image, FlatList } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const INITIAL_TASKS = [
  { id: 1, title: 'To check email' },
  { id: 2, title: 'UI task web page' },
  { id: 3, title: 'Learn javascript basic' },
  { id: 4, title: 'Learn HTML Advance' },
  { id: 5, title: 'Medical App UI' },
  { id: 6, title: 'Learn Java' },
];

// Define action types
const ADD_TASK = 'ADD_TASK';
const UPDATE_TASK = 'UPDATE_TASK';
const DELETE_TASK = 'DELETE_TASK';

// Reducer function
const taskReducer = (state, action) => {
  switch (action.type) {
    case ADD_TASK:
      return [...state, { ...action.payload, id: state.length + 1 }];
    case UPDATE_TASK:
      return state.map(task => 
        task.id === action.payload.id ? action.payload : task
      );
    case DELETE_TASK:
      return state.filter(task => task.id !== action.payload);
    default:
      return state;
  }
};

const HomeScreen = ({navigation}) => {
  const [name, setName] = useState('');

  return (
    <View style={styles.container}>
      <Image 
        source={require('./assets/product1.png')} 
        style={styles.image}
      />
      <Text style={styles.title}>MANAGE YOUR TASK</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('TaskList', {name})}
      >
        <Text style={styles.buttonText}>GET STARTED →</Text>
      </TouchableOpacity>
    </View>
  );
}

const TaskList = ({route, navigation}) => {
  const [tasks, dispatch] = useReducer(taskReducer, INITIAL_TASKS);
  const [searchText, setSearchText] = useState('');
  const {name} = route.params;

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderItem = ({item}) => (
    <View style={styles.taskItem}>
      <Text>✓</Text>
      <Text style={styles.taskText}>{item.title}</Text>
      <TouchableOpacity onPress={() => navigation.navigate('AddEditTask', {
        task: item,
        isEdit: true,
        onUpdate: (updatedTask) => {
          dispatch({ type: UPDATE_TASK, payload: updatedTask });
        }
      })}>
        <Text style={styles.editIcon}>✎</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text>Hi {name}</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search"
        value={searchText}
        onChangeText={setSearchText}
      />
      <FlatList
        data={filteredTasks}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => navigation.navigate('AddEditTask', {
          isEdit: false,
          onAdd: (newTask) => {
            dispatch({ type: ADD_TASK, payload: newTask });
            }
        })}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const AddEditTask = ({route, navigation}) => {
  const {isEdit, task, onAdd, onUpdate} = route.params;
  const [jobTitle, setJobTitle] = useState(isEdit ? task.title : '');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isEdit ? 'EDIT YOUR JOB' : 'ADD YOUR JOB'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Input your job"
        value={jobTitle}
        onChangeText={setJobTitle}
      />
      <TouchableOpacity 
        style={styles.button}
        onPress={() => {
          if(isEdit) {
            onUpdate({...task, title: jobTitle});
          } else {
            onAdd({title: jobTitle});
          }
          navigation.goBack();
        }}
      >
        <Text style={styles.buttonText}>FINISH →</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{headerShown: true}}
        />
        <Stack.Screen 
          name="TaskList" 
          component={TaskList}
          options={{headerShown: true}}
        />
        <Stack.Screen 
          name="AddEditTask" 
          component={AddEditTask}
          options={{headerShown: true}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  image: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  taskItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
  },
  taskText: {
    flex: 1,
    marginLeft: 10,
  },
  editIcon: {
    marginLeft: 10,
  },
  addButton: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
  },
});