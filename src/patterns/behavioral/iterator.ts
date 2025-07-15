import type { PatternUseCase } from '../../types'
import type { Logger } from '../creational/factory'

interface IIterator<T> {
  next(): T
  hasNext(): boolean
}

interface ParkingSpot {
  id: number
  isOccupied: boolean
}

class ParkingSpotIterator implements IIterator<ParkingSpot> {
  private parkingSpots: ParkingSpot[]
  private index: number

  constructor(parkingSpots: ParkingSpot[]) {
    this.parkingSpots = parkingSpots
    this.index = 0
  }

  next(): ParkingSpot {
    if (!this.hasNext()) throw new Error('No more parking spots')
    return this.parkingSpots[this.index++]
  }

  hasNext(): boolean {
    return this.index < this.parkingSpots.length
  }
}

class ParkingLot {
  private parkingSpots: ParkingSpot[]

  constructor(parkingSpots: ParkingSpot[]) {
    this.parkingSpots = parkingSpots
  }

  availableSpots(): ParkingSpot[] {
    const iterator = new ParkingSpotIterator(this.parkingSpots)
    const availableSpots: ParkingSpot[] = []
    while (iterator.hasNext()) {
      const spot = iterator.next()
      if (!spot.isOccupied) availableSpots.push(spot)
    }
    return availableSpots
  }
}

export const iteratorUseCase: PatternUseCase = (logger: Logger) => () => {
  const parkingSpots: ParkingSpot[] = [
    { id: 1, isOccupied: false },
    { id: 2, isOccupied: true },
    { id: 3, isOccupied: false },
    { id: 4, isOccupied: false },
    { id: 5, isOccupied: true }
  ]
  const parkingLot = new ParkingLot(parkingSpots)
  const availableSpots = parkingLot.availableSpots()
  logger.log(
    `Available parking spots: ${JSON.stringify(availableSpots, null, 2)}`
  )
}
