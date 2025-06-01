import React, { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { Avatar, Card, Text } from 'react-native-paper'
import {
  HKAuthorizationRequestStatus,
  HKQuantityTypeIdentifier,
  HKStatisticsOptions,
  HKUnits,
  UnitOfEnergy,
  useHealthkitAuthorization,
  useStatisticsForQuantity,
  useSubscribeToChanges,
} from '@kingstinct/react-native-healthkit'

function QuickStatsRow() {
  const today = React.useMemo(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), now.getDate())
  }, [])

  let values = {
    steps: 0,
    calories: 0,
    sleep: 0,
  }

  const [authorizationStatus] = useHealthkitAuthorization([
    HKQuantityTypeIdentifier.distanceWalkingRunning,
    HKQuantityTypeIdentifier.stepCount,
    HKQuantityTypeIdentifier.activeEnergyBurned,
  ])

  // Hooks must always be called unconditionally and in the same order
  const latestValue = useStatisticsForQuantity(
    HKQuantityTypeIdentifier.stepCount,
    [HKStatisticsOptions.cumulativeSum],
    today,
    undefined,
    HKUnits.Count
  )

  const caloriesBurned = useStatisticsForQuantity(
    HKQuantityTypeIdentifier.activeEnergyBurned,
    [HKStatisticsOptions.cumulativeSum],
    today,
    undefined,
    UnitOfEnergy.Kilocalories
  )

  // Only call hooks if authorized
  if (
    authorizationStatus !== HKAuthorizationRequestStatus.shouldRequest &&
    authorizationStatus !== HKAuthorizationRequestStatus.unnecessary
  ) {
    // Not authorized: show fallback UI
    return (
      <View style={styles.quickStatsRow}>
        <Card style={styles.quickStatCard} mode='contained'>
          <Card.Content style={styles.quickStatContent}>
            <Avatar.Icon
              size={28}
              icon='walk'
              style={styles.quickStatIcon}
              color='#fff'
            />
            <Text style={styles.quickStatLabel}>Steps</Text>
            <Text style={styles.quickStatValue}>-</Text>
          </Card.Content>
        </Card>
        <Card style={styles.quickStatCard} mode='contained'>
          <Card.Content style={styles.quickStatContent}>
            <Avatar.Icon
              size={28}
              icon='fire'
              style={styles.quickStatIcon}
              color='#fff'
            />
            <Text style={styles.quickStatLabel}>Burned</Text>
            <Text style={styles.quickStatValue}>-</Text>
          </Card.Content>
        </Card>
        <Card style={styles.quickStatCard} mode='contained'>
          <Card.Content style={styles.quickStatContent}>
            <Avatar.Icon
              size={28}
              icon='sleep'
              style={styles.quickStatIcon}
              color='#fff'
            />
            <Text style={styles.quickStatLabel}>Sleep</Text>
            <Text style={styles.quickStatValue}>-</Text>
          </Card.Content>
        </Card>
      </View>
    )
  }

  console.log('Calories Burned Data:', caloriesBurned)

  console.log('Steps Data:', latestValue)

  const quantity = latestValue?.sumQuantity ?? latestValue?.averageQuantity

  values.steps = quantity?.quantity ?? 0
  values.calories =
    Number(caloriesBurned?.sumQuantity?.quantity?.toFixed(2)) ?? 0
  values.sleep = 7.2 // Placeholder for sleep data

  const calories =
    caloriesBurned?.sumQuantity ?? caloriesBurned?.averageQuantity

  console.log('Quantity:', quantity)

  return (
    <View style={styles.quickStatsRow}>
      <Card style={styles.quickStatCard} mode='contained'>
        <Card.Content style={styles.quickStatContent}>
          <Avatar.Icon
            size={28}
            icon='walk'
            style={styles.quickStatIcon}
            color='#fff'
          />
          <Text style={styles.quickStatLabel}>Steps</Text>
          <Text style={styles.quickStatValue}>{values.steps} steps</Text>
        </Card.Content>
      </Card>
      <Card style={styles.quickStatCard} mode='contained'>
        <Card.Content style={styles.quickStatContent}>
          <Avatar.Icon
            size={28}
            icon='fire'
            style={styles.quickStatIcon}
            color='#fff'
          />
          <Text style={styles.quickStatLabel}>Burned</Text>
          <Text style={styles.quickStatValue}>{values.calories} kcal</Text>
        </Card.Content>
      </Card>
      <Card style={styles.quickStatCard} mode='contained'>
        <Card.Content style={styles.quickStatContent}>
          <Avatar.Icon
            size={28}
            icon='sleep'
            style={styles.quickStatIcon}
            color='#fff'
          />
          <Text style={styles.quickStatLabel}>Sleep</Text>
          <Text style={styles.quickStatValue}>{values.sleep} h</Text>
        </Card.Content>
      </Card>
    </View>
  )
}

export default QuickStatsRow

const styles = StyleSheet.create({
  quickStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 18,
    gap: 6,
  },
  quickStatCard: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: '#6c63ff',
    elevation: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickStatContent: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  quickStatIcon: {
    backgroundColor: '#6c63ff',
    marginBottom: 4,
  },
  quickStatLabel: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '500',
    marginBottom: 2,
  },
  quickStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
})
