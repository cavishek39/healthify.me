import React, { useRef, useState } from 'react'
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import { Avatar, Card, Text, TextInput, useTheme } from 'react-native-paper'

const PRIMARY_COLOR = '#6c63ff'
const BOT_AVATAR = '🤖'
const USER_AVATAR = '🧑'

type Message = {
  id: string
  text: string
  sender: 'user' | 'bot'
}

const chat = () => {
  // Use custom primary color for the chat screen
  const theme = useTheme()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your AI Health Assistant. How can I help you today?",
      sender: 'bot',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const flatListRef = useRef<FlatList>(null)

  // Simulate AI response (replace with real API call)
  const sendMessage = async () => {
    if (!input.trim()) return
    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    setTimeout(() => {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotReply(userMsg.text),
        sender: 'bot',
      }
      setMessages((prev) => [...prev, botMsg])
      setLoading(false)
      flatListRef.current?.scrollToEnd({ animated: true })
    }, 1200)
  }

  // Simple bot reply logic (replace with real AI)
  function getBotReply(userText: string) {
    if (userText.toLowerCase().includes('calorie')) {
      return "You can log your meals and I'll calculate your calories for you!"
    }
    if (userText.toLowerCase().includes('water')) {
      return 'Remember to drink at least 2.5L of water daily. Want to log your water intake?'
    }
    if (userText.toLowerCase().includes('bmi')) {
      return 'Your BMI is calculated from your height and weight. Would you like to update your profile?'
    }
    return "I'm here to help with your health, nutrition, and wellness questions!"
  }

  const renderItem = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user'
    return (
      <View
        style={[
          styles.messageRow,
          isUser ? styles.messageRowUser : styles.messageRowBot,
        ]}>
        {!isUser && (
          <Avatar.Text
            size={36}
            label={BOT_AVATAR}
            style={[
              styles.avatar,
              { backgroundColor: PRIMARY_COLOR, elevation: 2 },
            ]}
          />
        )}
        <Card
          style={[
            styles.messageBubble,
            isUser
              ? {
                  backgroundColor: '#f5f5f5',
                  marginLeft: 40,
                  borderTopRightRadius: 8,
                  borderBottomRightRadius: 18,
                  borderBottomLeftRadius: 18,
                  borderTopLeftRadius: 18,
                  borderWidth: 1,
                  borderColor: '#ececff',
                }
              : {
                  backgroundColor: PRIMARY_COLOR,
                  marginRight: 40,
                  borderTopLeftRadius: 8,
                  borderBottomRightRadius: 18,
                  borderBottomLeftRadius: 18,
                  borderTopRightRadius: 18,
                  borderWidth: 1,
                  borderColor: '#ececff',
                  shadowColor: PRIMARY_COLOR,
                  shadowOpacity: 0.12,
                  shadowRadius: 8,
                  elevation: 4,
                },
          ]}
          elevation={0}>
          <Card.Content>
            <Text
              style={[
                styles.messageText,
                isUser ? { color: '#222' } : { color: '#fff' },
              ]}>
              {item.text}
            </Text>
          </Card.Content>
        </Card>
        {isUser && (
          <Avatar.Text
            size={36}
            label={USER_AVATAR}
            style={[
              styles.avatar,
              { backgroundColor: '#ececff', elevation: 2 },
            ]}
          />
        )}
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: '#f7f7ff', flex: 1 }]}>
      <View style={styles.header}>
        <Avatar.Text
          size={36}
          label={BOT_AVATAR}
          style={{ backgroundColor: PRIMARY_COLOR, marginRight: 10 }}
        />
        <Text style={styles.headerTitle}>AI Health Chat</Text>
      </View>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatList}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        keyboardShouldPersistTaps='handled'
      />
      {loading && (
        <View style={styles.loadingRow}>
          <ActivityIndicator color={PRIMARY_COLOR} size='small' />
          <Text style={{ marginLeft: 8, color: PRIMARY_COLOR }}>
            AI is typing...
          </Text>
        </View>
      )}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
        <View style={styles.inputRow}>
          <View style={styles.inputWrapper}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder='Type your message...'
              style={styles.input}
              mode='flat'
              outlineColor={PRIMARY_COLOR}
              activeOutlineColor={PRIMARY_COLOR}
              onSubmitEditing={sendMessage}
              blurOnSubmit={false}
              returnKeyType='send'
              theme={{
                colors: {
                  primary: PRIMARY_COLOR,
                  background: '#f8f8ff',
                  text: '#222',
                  placeholder: '#aaa',
                },
              }}
              left={
                <TextInput.Icon
                  icon='message-text-outline'
                  color={PRIMARY_COLOR}
                />
              }
              underlineColor='transparent'
              selectionColor={PRIMARY_COLOR}
            />
          </View>
          <TouchableOpacity
            style={[
              styles.sendButton,
              { backgroundColor: input.trim() ? PRIMARY_COLOR : '#ccc' },
            ]}
            onPress={sendMessage}
            disabled={!input.trim() || loading}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}

export default chat

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ececff',
    paddingTop: Platform.OS === 'ios' ? 54 : 24,
    paddingBottom: 12,
    paddingHorizontal: 18,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    elevation: 4,
    shadowColor: PRIMARY_COLOR,
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: PRIMARY_COLOR,
    letterSpacing: 0.5,
  },
  chatList: {
    padding: 16,
    paddingBottom: 8,
    flexGrow: 1,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 14,
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  messageRowBot: {
    justifyContent: 'flex-start',
  },
  avatar: {
    marginHorizontal: 4,
    marginBottom: 2,
    elevation: 2,
  },
  messageBubble: {
    maxWidth: '70%',
    minWidth: 60,
    paddingVertical: 6,
    paddingHorizontal: 0,
    borderRadius: 18,
    shadowColor: 'transparent',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 0.5,
    borderTopColor: '#eee',
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: '#ececff',
    borderRadius: 18,
    marginRight: 8,
    overflow: 'hidden',
    borderWidth: 1.2,
    borderColor: PRIMARY_COLOR,
    elevation: 2,
  },
  input: {
    backgroundColor: 'transparent',
    borderRadius: 18,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: 44,
  },
  sendButton: {
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.2,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 24,
    paddingBottom: 4,
  },
})
