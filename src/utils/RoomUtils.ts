import { DailyCall } from '@daily-co/daily-js'

export const backgroundBlur = (strength: number, co: DailyCall | null) => {
	if (co) {
		co.updateInputSettings({
			video: {
				processor: {
					type: 'background-blur',
					config: { strength },
				},
			},
		})
	}
}

export const backgroundNone = (co: DailyCall | null) => {
    if (co) {

        co.updateInputSettings({
            video: {
                processor: {
                    type: 'none',
                },
            },
        })
    }
}

export const backgroundImage = (image: string, co: DailyCall | null) => {
	if (co) {
		co.updateInputSettings({
			video: {
			  processor: {
				type: 'background-image',
				config: {
				  source: image
				},
			  },
			},
		  });
	}
}

