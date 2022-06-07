import { useEffect, useRef } from 'react'
import { useMediaTrack } from '@daily-co/daily-react-hooks'
import { SwiperSlide } from 'swiper/react'

export default function Tile({
	id,
	isCurrentUser = false,
}: {
	id: string
	isCurrentUser?: boolean
}) {
	const videoTrack = useMediaTrack(id, 'video')
	const audioTrack = useMediaTrack(id, 'audio')

	const videoElement = useRef<any>(null)
	const audioElement = useRef<any>(null)

	useEffect(() => {
		/*  The track is ready to be played. We can show video of the remote participant in the UI.*/
		if (videoTrack?.state === 'playable') {
			videoElement.current &&
				(videoElement.current.srcObject =
					videoTrack && new MediaStream([videoTrack.persistentTrack] as any))
		}
	}, [videoTrack])

	useEffect(() => {
		if (audioTrack?.state === 'playable') {
			audioElement?.current &&
				(audioElement.current.srcObject =
					audioTrack && new MediaStream([audioTrack.persistentTrack] as any))
		}
	}, [audioTrack])

	return (
		<SwiperSlide
			style={{
				height: '165px',
				background: videoTrack ? '#000000' : '#222222',
				borderRadius: '15px',
				overflow: 'hidden',
        position: 'relative',
			}}
		>
			{videoTrack && (
				<video
					autoPlay
					muted
					playsInline
					style={{
						width: 'max-content',
						height: '100%',
					}}
					ref={videoElement}
				/>
			)}
			{!isCurrentUser && audioTrack && <audio autoPlay playsInline ref={audioElement} />}
		</SwiperSlide>
	)
}
