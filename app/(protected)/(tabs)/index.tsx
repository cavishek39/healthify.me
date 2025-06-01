import QuickStatsRow from '@/components/containers/QuickStats'
import { useAuth } from '@/context/AuthProvider'
import { supabase } from '@/utils/supabase'
import React, { useEffect, useRef, useState } from 'react'
import { Alert, Animated, Platform, StyleSheet, View } from 'react-native'
import {
  Avatar,
  Button,
  Card,
  Chip,
  Modal,
  Portal,
  ProgressBar,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper'

const MEAL_SECTIONS = [
  { key: 'morningSnacks', label: 'Morning Snacks', icon: 'weather-sunset' },
  { key: 'breakfast', label: 'Breakfast', icon: 'food-croissant' },
  { key: 'lunch', label: 'Lunch', icon: 'food' },
  { key: 'eveningSnacks', label: 'Evening Snacks', icon: 'coffee' },
  { key: 'dinner', label: 'Dinner', icon: 'food-variant' },
]

// --- Modularized Components ---

// AnimatedHeader component to display the app title with animation
function AnimatedHeader({ headerTranslate }: { headerTranslate: any }) {
  return (
    <Animated.View
      style={[
        styles.animatedHeader,
        { transform: [{ translateY: headerTranslate }] },
      ]}>
      <Text style={styles.headerTitle}>HealthyFi</Text>
    </Animated.View>
  )
}

// ProfilePromptCard component to prompt user to complete their profile
function ProfilePromptCard({ onPress }: { onPress: () => void }) {
  return (
    <Card style={styles.profileCard} mode='contained'>
      <Card.Content style={{ alignItems: 'center' }}>
        <Avatar.Icon
          icon='account'
          size={48}
          style={{ backgroundColor: '#6c63ff', marginBottom: 8 }}
          color='#fff'
        />
        <Text style={styles.profileTitle}>Let's Get To Know You</Text>
        <Text style={styles.profileSubtitle}>
          Please complete your profile for personalized insights.
        </Text>
        <Button
          mode='contained'
          onPress={onPress}
          style={styles.premiumButton}
          labelStyle={styles.premiumButtonLabel}>
          Complete Profile
        </Button>
      </Card.Content>
    </Card>
  )
}

// WeightCard component to display current weight and weight difference
function WeightCard({
  currentWeight,
  weightDiff,
  onEdit,
}: {
  currentWeight: number | null
  weightDiff: string | null
  onEdit: () => void
}) {
  return (
    <Card style={styles.card} mode='outlined'>
      <Card.Title
        title='Weight'
        titleStyle={styles.cardTitle}
        left={(props) => (
          <Avatar.Icon
            {...props}
            icon='scale-bathroom'
            color='#fff'
            style={styles.weightIcon}
          />
        )}
        right={(props) => (
          <Button
            {...props}
            mode='text'
            onPress={onEdit}
            icon='pencil'
            compact
            labelStyle={styles.editLabel}>
            Edit
          </Button>
        )}
      />
      <Card.Content>
        <Text style={styles.weightText}>
          {currentWeight ? `${currentWeight} kg` : '--'}
          {weightDiff && (
            <Text
              style={
                Number(weightDiff) < 0 ? styles.weightLoss : styles.weightGain
              }>
              {' '}
              ({Number(weightDiff) > 0 ? '+' : ''}
              {weightDiff} kg)
            </Text>
          )}
        </Text>
        <Text style={styles.weightSub}>
          {weightDiff
            ? Number(weightDiff) < 0
              ? 'Weight Loss'
              : 'Weight Gain'
            : ''}
        </Text>
      </Card.Content>
    </Card>
  )
}

// NutritionCard component to display daily nutrition intake
function NutritionCard({
  caloriesTaken,
  caloriesGoal,
  foodsBySection,
  onEdit,
  theme,
}: {
  caloriesTaken: number
  caloriesGoal: number
  foodsBySection: any
  onEdit: () => void
  theme: any
}) {
  return (
    <Card style={styles.card} mode='outlined'>
      <Card.Title
        title="Today's Nutrition"
        titleStyle={styles.cardTitle}
        left={(props) => (
          <Avatar.Icon
            {...props}
            icon='food-apple'
            color='#fff'
            style={styles.mealIcon}
          />
        )}
        right={(props) => (
          <Button
            {...props}
            mode='text'
            onPress={onEdit}
            icon='pencil'
            compact
            labelStyle={styles.editLabel}>
            Edit
          </Button>
        )}
      />
      <Card.Content>
        <Text variant='titleLarge' style={styles.caloriesText}>
          {caloriesTaken}{' '}
          <Text style={styles.caloriesUnit}>/ {caloriesGoal} kcal</Text>
        </Text>
        <ProgressBar
          progress={Math.min(caloriesTaken / caloriesGoal, 1)}
          color={theme.colors.primary}
          style={styles.premiumProgressBar}
        />
        <View style={styles.sectionRow}>
          {MEAL_SECTIONS.map((section) => {
            const foods = foodsBySection[section.key] || []
            return (
              <View key={section.key} style={styles.mealSection}>
                <View style={styles.mealHeader}>
                  <Avatar.Icon
                    size={28}
                    icon={section.icon}
                    style={styles.mealIcon}
                    color='#fff'
                  />
                  <Text style={styles.mealLabel}>{section.label}</Text>
                </View>
                <View style={styles.chipRow}>
                  {foods.length === 0 ? (
                    <Chip icon='plus' style={styles.emptyChip} compact>
                      Add
                    </Chip>
                  ) : (
                    foods.map((food: any, i: number) => (
                      <Chip
                        key={i}
                        icon='check'
                        style={styles.foodChip}
                        compact>
                        {food.name}
                      </Chip>
                    ))
                  )}
                </View>
              </View>
            )
          })}
        </View>
      </Card.Content>
    </Card>
  )
}

// BMICard component to display user's BMI and status
function BMICard({ bmi }: { bmi: string | null }) {
  return !bmi ? null : (
    <Card style={styles.card} mode='outlined'>
      <Card.Title
        title='Your BMI'
        titleStyle={styles.cardTitle}
        left={(props) => (
          <Avatar.Icon
            {...props}
            icon='human-male-height'
            color='#fff'
            style={styles.mealIcon}
          />
        )}
      />
      <Card.Content>
        <Text variant='headlineLarge' style={styles.bmiValue}>
          {bmi}
        </Text>
        <Text variant='bodyMedium' style={styles.bmiStatus}>
          {Number(bmi) < 18.5
            ? 'Underweight'
            : Number(bmi) < 25
            ? 'Normal'
            : Number(bmi) < 30
            ? 'Overweight'
            : 'Obese'}
        </Text>
      </Card.Content>
    </Card>
  )
}

// WaterCard component to track water intake
function WaterCard({
  water,
  waterGoal,
  setWater,
}: {
  water: number
  waterGoal: number
  setWater: (fn: (w: number) => number) => void
}) {
  return (
    <Card style={styles.card} mode='outlined'>
      <Card.Title
        title='Water Intake'
        titleStyle={styles.cardTitle}
        left={(props) => (
          <Avatar.Icon
            {...props}
            icon='cup-water'
            color='#fff'
            style={styles.mealIcon}
          />
        )}
      />
      <Card.Content>
        <Text variant='titleLarge' style={styles.waterText}>
          {water} <Text style={styles.waterUnit}>/ {waterGoal} ml</Text>
        </Text>
        <ProgressBar
          progress={Math.min(water / waterGoal, 1)}
          color='#2196f3'
          style={styles.premiumProgressBar}
        />
        <View style={styles.waterRow}>
          {[200, 300, 500].map((amount) => (
            <Button
              key={amount}
              mode='outlined'
              icon='cup'
              compact
              style={styles.waterButton}
              labelStyle={styles.waterButtonLabel}
              onPress={() => setWater((w) => Math.min(w + amount, waterGoal))}>
              +{amount}ml
            </Button>
          ))}
        </View>
      </Card.Content>
    </Card>
  )
}

// --- Main HomeScreen ---

export default function HomeScreen() {
  const { logOut, user } = useAuth()
  const theme = useTheme()
  const isDark = theme.dark

  // Demo state, replace with real data
  const [profile, setProfile] = useState<{
    age: number | null
    gender: string
    height: number | null
    weight: number | null
  }>({
    age: null,
    gender: '',
    height: null,
    weight: null,
  })
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [foodsBySection, setFoodsBySection] = useState({
    morningSnacks: [{ name: 'Almonds', calories: 80 }],
    breakfast: [
      { name: 'Oatmeal', calories: 150 },
      { name: 'Banana', calories: 90 },
    ],
    lunch: [{ name: 'Chicken Salad', calories: 350 }],
    eveningSnacks: [{ name: 'Apple', calories: 80 }],
    dinner: [{ name: 'Grilled Fish', calories: 220 }],
  })
  const [caloriesGoal, setCaloriesGoal] = useState(2000)
  const [water, setWater] = useState(1200) // ml
  const [waterGoal, setWaterGoal] = useState(2500)
  const [weightHistory, setWeightHistory] = useState([
    { date: '2024-06-01', weight: 72 },
    { date: '2024-06-10', weight: 71.2 },
    { date: '2024-06-20', weight: 70.5 },
    { date: '2024-06-28', weight: 70 },
  ])
  const caloriesTaken = Object.values(foodsBySection)
    .flat()
    .reduce((sum, f) => sum + f.calories, 0)
  const bmi =
    profile.height && profile.weight
      ? (profile.weight / (profile.height / 100) ** 2).toFixed(1)
      : null

  // Profile modal form state
  const [form, setForm] = useState({
    age: '',
    gender: '',
    height: '',
    weight: '',
  })

  // Header hide on scroll
  const scrollY = useRef(new Animated.Value(0)).current
  const headerTranslate = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [0, -80],
    extrapolate: 'clamp',
  })

  // Load profile from Supabase on mount
  useEffect(() => {
    if (!user) return
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()
      if (data) {
        setProfile({
          age: data.age,
          gender: data.gender,
          height: data.height_cm,
          weight: data.weight_kg,
        })
        // Optionally, handle other fields as needed
        // setWeightHistory(data.weight_history || [])
      }
    }
    fetchProfile()
  }, [user])

  const handleProfileSubmit = async () => {
    setProfile({
      age: Number(form.age),
      gender: form.gender,
      height: Number(form.height),
      weight: Number(form.weight),
    })
    // Save to Supabase
    if (user) {
      // Ensure gender is lowercase to match DB constraint
      const genderValue = form.gender.trim().toLowerCase()
      const allowedGenders = ['male', 'female', 'other']
      if (!allowedGenders.includes(genderValue)) {
        Alert.alert(
          'Invalid Gender',
          'Gender must be "male", "female", or "other"'
        )
        return
      }

      const { data, status, statusText, error } = await supabase
        .from('users')
        .update({
          age: Number(form.age),
          gender: genderValue,
          height_cm: Number(form.height),
          weight_kg: Number(form.weight),
          // add other fields if needed
        })
        .eq('id', user.id)

      if (error || status !== 200) {
        console.error('Error updating profile:', error)
        Alert.alert('Profile Update Failed', error?.message || 'Unknown error')
      } else {
        // Optionally, update weight history
        setWeightHistory((prev) => [
          ...prev,
          {
            date: new Date().toISOString().split('T')[0],
            weight: Number(form.weight),
          },
        ])

        Alert.alert('Profile Updated', statusText, [{ text: 'OK' }])
        setShowProfileModal(false)
      }
    }
  }

  // Weight section helpers
  const currentWeight = weightHistory.length
    ? weightHistory[weightHistory.length - 1].weight
    : null
  const startWeight = weightHistory.length ? weightHistory[0].weight : null
  const weightDiff =
    currentWeight && startWeight
      ? (currentWeight - startWeight).toFixed(1)
      : null

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <AnimatedHeader headerTranslate={headerTranslate} />

      <Animated.ScrollView
        contentContainerStyle={[
          styles.scroll,
          { backgroundColor: theme.colors.background },
        ]}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}>
        {(!profile.age ||
          !profile.gender ||
          !profile.height ||
          !profile.weight) && (
          <ProfilePromptCard onPress={() => setShowProfileModal(true)} />
        )}

        <QuickStatsRow />

        <WeightCard
          currentWeight={currentWeight}
          weightDiff={weightDiff}
          onEdit={() => setShowProfileModal(true)}
        />

        <NutritionCard
          caloriesTaken={caloriesTaken}
          caloriesGoal={caloriesGoal}
          foodsBySection={foodsBySection}
          onEdit={() => setShowProfileModal(true)}
          theme={theme}
        />

        <BMICard bmi={bmi} />

        <WaterCard water={water} waterGoal={waterGoal} setWater={setWater} />

        <Button
          mode='outlined'
          onPress={logOut}
          style={[
            styles.logoutButton,
            isDark && {
              backgroundColor: theme.colors.surface,
              borderColor: '#333',
            },
          ]}
          icon='logout'
          labelStyle={[
            styles.logoutLabel,
            isDark && { color: theme.colors.primary },
          ]}>
          Log Out
        </Button>
      </Animated.ScrollView>

      <Portal>
        <Modal
          visible={showProfileModal}
          onDismiss={() => setShowProfileModal(false)}
          contentContainerStyle={[
            styles.modal,
            isDark && { backgroundColor: theme.colors.surface },
          ]}>
          <Text
            variant='titleLarge'
            style={[styles.modalTitle, isDark && { color: theme.colors.text }]}>
            Enter Your Details
          </Text>
          <TextInput
            label='Age'
            value={form.age}
            onChangeText={(v) => setForm((f) => ({ ...f, age: v }))}
            keyboardType='numeric'
            style={[
              styles.input,
              isDark && {
                backgroundColor: theme.colors.background,
                color: theme.colors.text,
              },
            ]}
            theme={
              isDark
                ? {
                    colors: {
                      background: theme.colors.background,
                      text: theme.colors.text,
                    },
                  }
                : undefined
            }
          />
          <TextInput
            label='Gender'
            value={form.gender}
            onChangeText={(v) => setForm((f) => ({ ...f, gender: v }))}
            style={[
              styles.input,
              isDark && {
                backgroundColor: theme.colors.background,
                color: theme.colors.text,
              },
            ]}
            theme={
              isDark
                ? {
                    colors: {
                      background: theme.colors.background,
                      text: theme.colors.text,
                    },
                  }
                : undefined
            }
          />
          <TextInput
            label='Height (cm)'
            value={form.height}
            onChangeText={(v) => setForm((f) => ({ ...f, height: v }))}
            keyboardType='numeric'
            style={[
              styles.input,
              isDark && {
                backgroundColor: theme.colors.background,
                color: theme.colors.text,
              },
            ]}
            theme={
              isDark
                ? {
                    colors: {
                      background: theme.colors.background,
                      text: theme.colors.text,
                    },
                  }
                : undefined
            }
          />
          <TextInput
            label='Weight (kg)'
            value={form.weight}
            onChangeText={(v) => setForm((f) => ({ ...f, weight: v }))}
            keyboardType='numeric'
            style={[
              styles.input,
              isDark && {
                backgroundColor: theme.colors.background,
                color: theme.colors.text,
              },
            ]}
            theme={
              isDark
                ? {
                    colors: {
                      background: theme.colors.background,
                      text: theme.colors.text,
                    },
                  }
                : undefined
            }
          />
          <Button
            mode='contained'
            onPress={handleProfileSubmit}
            style={[
              styles.premiumButton,
              isDark && { backgroundColor: theme.colors.primary },
            ]}
            labelStyle={[
              styles.premiumButtonLabel,
              isDark && { color: theme.colors.onPrimary || '#fff' },
            ]}>
            Save
          </Button>
        </Modal>
      </Portal>
    </View>
  )
}

const styles = StyleSheet.create({
  animatedHeader: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 26 : 24,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    elevation: 5,
    alignItems: 'flex-start',
    // backgroundColor: '#ececff',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6c63ff',
    letterSpacing: 1,
  },
  scroll: {
    padding: 16,
    paddingBottom: 120,
    paddingTop: 80,
  },
  profileCard: {
    marginBottom: 18,
    borderRadius: 22,
    backgroundColor: '#6c63ff',
    // Premium shadow
    shadowColor: '#6c63ff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 12,
    borderWidth: 0,
  },
  profileTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
    textAlign: 'center',
  },
  profileSubtitle: {
    fontSize: 15,
    color: '#e0e0e0',
    marginBottom: 12,
    textAlign: 'center',
  },
  card: {
    marginBottom: 18,
    borderRadius: 20,
    backgroundColor: '#fff',
    // Premium shadow
    shadowColor: '#222',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.13,
    shadowRadius: 18,
    elevation: 10,
    borderWidth: 0.5,
    borderColor: '#ececec',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.2,
    color: '#222',
  },
  caloriesText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  caloriesUnit: {
    fontSize: 16,
    color: '#888',
    fontWeight: '500',
  },
  premiumProgressBar: {
    height: 3,
    borderRadius: 2,
    marginBottom: 12,
    backgroundColor: '#f2f2f2',
  },
  sectionRow: {
    flexDirection: 'column',
    gap: 10,
    marginTop: 8,
  },
  mealSection: {
    marginBottom: 4,
  },
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  mealIcon: {
    backgroundColor: '#6c63ff',
    marginRight: 8,
  },
  mealLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#444',
    letterSpacing: 0.1,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 2,
  },
  foodChip: {
    backgroundColor: '#f5f5f5',
    marginRight: 4,
    marginBottom: 4,
    fontSize: 13,
  },
  emptyChip: {
    backgroundColor: '#e0e0e0',
    color: '#888',
    marginRight: 4,
    marginBottom: 4,
    fontSize: 13,
  },
  bmiValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
  },
  bmiStatus: {
    fontSize: 16,
    color: '#6c63ff',
    fontWeight: '600',
    marginTop: 2,
  },
  waterText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
  },
  waterUnit: {
    fontSize: 15,
    color: '#888',
    fontWeight: '500',
  },
  waterRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  waterButton: {
    borderRadius: 16,
    borderColor: '#2196f3',
    backgroundColor: '#e3f2fd',
    marginRight: 6,
  },
  waterButtonLabel: {
    color: '#2196f3',
    fontWeight: '600',
    fontSize: 13,
  },
  weightIcon: {
    backgroundColor: '#6c63ff',
    marginRight: 8,
  },
  weightText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
  },
  weightLoss: {
    color: '#2196f3',
    fontWeight: '700',
    fontSize: 16,
  },
  weightGain: {
    color: '#ff7043',
    fontWeight: '700',
    fontSize: 16,
  },
  weightSub: {
    fontSize: 15,
    color: '#888',
    marginTop: 2,
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: '12%',
    backgroundColor: '#6c63ff',
    borderRadius: 32,
    elevation: 8,
    shadowColor: '#6c63ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  modal: {
    backgroundColor: 'white',
    padding: 28,
    margin: 24,
    borderRadius: 18,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    color: '#222',
    textAlign: 'center',
  },
  input: {
    marginBottom: 14,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  premiumButton: {
    borderRadius: 12,
    backgroundColor: '#fff',
    marginTop: 8,
    elevation: 1,
  },
  premiumButtonLabel: {
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.2,
    color: '#6c63ff',
  },
  editLabel: {
    fontSize: 14,
    color: '#6c63ff',
    fontWeight: '600',
  },
  logoutButton: {
    marginTop: 32,
    alignSelf: 'center',
    borderRadius: 10,
    borderColor: '#eee',
    backgroundColor: '#fff',
    elevation: 0,
    paddingHorizontal: 24,
    paddingVertical: 4,
  },
  logoutLabel: {
    color: '#6c63ff',
    fontWeight: '700',
    fontSize: 15,
  },
})
