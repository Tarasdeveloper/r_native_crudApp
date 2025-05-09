import { useContext, useEffect, useState } from 'react';
import { Inter_500Medium, useFonts } from '@expo-google-fonts/inter';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ThemeContext } from '@/context/ThemeContext';
import { data } from '@/data/todos';
import {
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import Octicons from '@expo/vector-icons/Octicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

export default function Index() {
    const [todos, setTodos] = useState([]);
    const [text, setText] = useState('');
    const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);
    const router = useRouter();
    const [loaded, error] = useFonts({ Inter_500Medium });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem('TodoApp');
                const storageTodos =
                    jsonValue != null ? JSON.parse(jsonValue) : null;
                if (storageTodos && storageTodos.length) {
                    setTodos(storageTodos.sort((a, b) => b.id - a.id));
                } else {
                    setTodos(data.sort((a, b) => b.id - a.id));
                }
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const storeData = async () => {
            try {
                const jsonValue = JSON.stringify(todos);
                await AsyncStorage.setItem('TodoApp', jsonValue);
            } catch (err) {
                console.error('Error storing data:', err);
            }
        };
        storeData();
    }, [todos]);

    if (!error && !loaded) return null;

    const styles = createStyles(theme, colorScheme);

    const addTodo = () => {
        if (text.trim()) {
            const newId =
                todos.length > 0
                    ? Math.max(...todos.map((todo) => todo.id)) + 1
                    : 1;
            setTodos([{ id: newId, title: text, completed: false }, ...todos]);
            setText('');
        }
    };

    const toggleTodo = (id) =>
        setTodos(
            todos.map((todo) =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        );
    const deleteTodo = (id) => {
        setTodos(todos.filter((todo) => todo.id !== id));
    };

    const handlePress = (id) => {
        router.push(`/todos/${id}`);
    };

    const renderItem = ({ item }) => (
        <View style={styles.todoItem}>
            <Pressable
                onPress={() => handlePress(item.id)}
                onLongPress={() => toggleTodo(item.id)}
            >
                <Text
                    style={[
                        styles.todoText,
                        item.completed && styles.completedText,
                    ]}
                >
                    {item.title}
                </Text>
            </Pressable>
            <Pressable onPress={() => deleteTodo(item.id)}>
                <MaterialCommunityIcons
                    name="delete-circle"
                    size={36}
                    color="red"
                    selectable={undefined}
                />
            </Pressable>
        </View>
    );
    // const clearCompleted = () => {
    //     setTodos(todos.filter((todo) => !todo.completed));
    // };
    // const editTodo = (id, newText) => {
    //     setTodos(
    //         todos.map((todo) =>
    //             todo.id === id ? { ...todo, text: newText } : todo
    //         )
    //     );
    // };
    // const toggleAll = (completed) => {
    //     setTodos(todos.map((todo) => ({ ...todo, completed })));
    // };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.inputContainer}>
                <Pressable
                    onPress={() =>
                        setColorScheme(
                            colorScheme === 'light' ? 'dark' : 'light'
                        )
                    }
                    style={{ marginRight: 10 }}
                >
                    <Octicons
                        name={colorScheme === 'dark' ? 'moon' : 'sun'}
                        size={36}
                        color={theme.text}
                        selectable={undefined}
                        style={{ width: 36 }}
                    />
                </Pressable>
                <TextInput
                    style={styles.input}
                    maxLength={30}
                    placeholder="Add a new todo"
                    placeholderTextColor="gray"
                    value={text}
                    onChangeText={setText}
                />
                <Pressable onPress={addTodo} style={styles.addButton}>
                    <Text style={styles.addButtonText}>Add</Text>
                </Pressable>
            </View>
            <Animated.FlatList
                data={todos}
                renderItem={renderItem}
                keyExtractor={(todo) => todo.id.toString()}
                contentContainerStyle={{ flexGrow: 1 }}
                itemLayoutAnimation={LinearTransition}
                keyboardDismissMode="on-drag"
            />
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        </SafeAreaView>
    );
}

function createStyles(theme, colorScheme) {
    return StyleSheet.create({
        container: {
            paddingTop: 30,
            flex: 1,
            backgroundColor: theme.background,
        },
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
            padding: 10,
            width: '100%',
            maxWidth: 1024,
            marginHorizontal: 'auto',
            pointerEvents: 'auto',
        },
        input: {
            flex: 1,
            borderWidth: 1,
            borderColor: 'gray',
            borderRadius: 5,
            padding: 10,
            marginRight: 10,
            fontSize: 18,
            fontFamily: 'Inter_500Medium',
            minWidth: 0,
            color: theme.text,
        },
        addButton: {
            backgroundColor: theme.button,
            borderRadius: 5,
            padding: 10,
        },
        addButtonText: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colorScheme === 'dark' ? '#000' : '#fff',
        },
        todoItem: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 4,
            padding: 10,
            borderBottomWidth: 1,
            borderBottomColor: 'gray',
            width: '100%',
            maxWidth: 1024,
            marginHorizontal: 'auto',
            pointerEvents: 'auto',
        },
        todoText: {
            flex: 1,
            fontSize: 18,
            fontFamily: 'Inter_500Medium',
            color: theme.text,
        },
        completedText: {
            textDecorationLine: 'line-through',
            color: 'gray',
        },
    });
}
