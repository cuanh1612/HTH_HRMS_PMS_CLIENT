export const compareTime = (inClock: string, outClock: string) => {
	const inClockSplit = inClock.split(' ')
	const outClockSplit = outClock.split(' ')
	if (inClockSplit[1] == 'PM' && outClockSplit[1] == 'AM') {
		return true
	}
	const timeInClock = inClockSplit[0].split(':')
	const timeOutClock = outClockSplit[0].split(':')
	if (Number(timeInClock[0]) >= Number(timeOutClock[0])) {
		return true
	}
	if (
		timeInClock[0] == timeOutClock[0] &&
		timeOutClock[1] <= timeInClock[1] &&
		inClockSplit[1] == 'PM' &&
		outClockSplit[1] == 'AM'
	) {
		return true
	}
	return false
}

export const compareDateTime = (date1: string, date2: string, inClock: string, outClock: string) => {
	if (new Date(date1).toLocaleString() == new Date(date2).toLocaleString()) {
		

		const inClockSplit = inClock.split(' ')
		const outClockSplit = outClock.split(' ')
		if (inClockSplit[1] == 'PM' && outClockSplit[1] == 'AM') {
			return true
		}
		const timeInClock = inClockSplit[0].split(':')
		const timeOutClock = outClockSplit[0].split(':')
		if (Number(timeInClock[0]) >= Number(timeOutClock[0])) {
			console.log('fxsdf')
			return true
		}
		if (
			timeInClock[0] == timeOutClock[0] &&
			timeOutClock[1] <= timeInClock[1] &&
			inClockSplit[1] == 'PM' &&
			outClockSplit[1] == 'AM'
		) {
			return true
		}
	}
	if (new Date(date1).toLocaleString() < new Date(date2).toLocaleString()) {
		return true
	}
	return false
}

export const setTime = (time: string) => {
	if (time.split(' ')[1] && time.split(' ')[1] == ('AM' || 'PM')) {
		const hoursAminutes = time.split(':')
		return {
			time,
			hours: Number(hoursAminutes[0]),
			minutes: Number(hoursAminutes[1]),
			AMOrPM: time.split(' ')[1],
		}
	}
	const timeSplit = time.split(':')
	if (Number(timeSplit[0]) > 12) {
		return {
			time: `0${Number(timeSplit[0]) - 12}` + ':' + timeSplit[1] + ' PM',
			hours: Number(timeSplit[0]) - 12,
			minutes: Number(timeSplit[1]),
			AMOrPM: 'PM',
		}
	}

	return {
		time: `0${Number(timeSplit[0])}` + ':' + timeSplit[1] + ' AM',
		hours: Number(timeSplit[0]),
		minutes: Number(timeSplit[1]),
		AMOrPM: 'AM',
	}
}

export const getMinutes = (startTime: string, endTime: string) => {
	if (startTime && endTime) {
		const HaMStart = startTime.split(':')
		const HaMEnd = endTime.split(':')
		
		return `${
			Number(HaMEnd[0]) * 60 +
			Number(HaMEnd[1]) -
			(Number(HaMStart[0]) * 60 + Number(HaMStart[1]))
		} minutes`
	}
	return null
}
