import { useState } from 'react';
import {
    FlatList,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { data } from '@/data/todos';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function Index() {
    const [todos, setTodos] = useState(data.sort((a, b) => a.id - b.id));
    const [text, setText] = useState('');

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

    const renderItem = ({ item }) => (
        <View style={styles.todoItem}>
            <Text
                style={[
                    styles.todoText,
                    item.completed && styles.completedText,
                ]}
                onPress={() => toggleTodo(item.id)}
            >
                {item.title}
            </Text>
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
                <TextInput
                    style={styles.input}
                    placeholder="Add a new todo"
                    placeholderTextColor="gray"
                    value={text}
                    onChangeText={setText}
                />
                <Pressable onPress={addTodo} style={styles.addButton}>
                    <Text style={styles.addButtonText}>Add</Text>
                </Pressable>
            </View>
            <FlatList
                data={todos}
                renderItem={renderItem}
                keyExtractor={(todo) => todo.id.toString()}
                contentContainerStyle={{ flexGrow: 1 }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
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
        minWidth: 0,
        color: '#fff',
    },
    addButton: {
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 10,
    },
    addButtonText: {
        fontSize: 18,
        color: '#000',
        fontWeight: 'bold',
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
        color: '#fff',
    },
    completedText: {
        textDecorationLine: 'line-through',
        color: 'gray',
    },
});
