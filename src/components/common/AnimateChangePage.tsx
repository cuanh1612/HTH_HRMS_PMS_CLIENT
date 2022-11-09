import { AnimatePresence, motion } from "framer-motion"
import { useRouter } from "next/router"
import { ReactNode } from "react"

export const AnimateChangePage = ({children}: {children: ReactNode}) => {
    const {route} = useRouter()
	return (
		<AnimatePresence exitBeforeEnter>
			<motion.div
				animate={{ opacity: 1, x: 0 }}
				key={route}
				initial={{ opacity: 0 }}
				exit={{ opacity: 0, x: 250, transition: { duration: 1 } }}
			>
                {children}
            </motion.div>
		</AnimatePresence>
	)
}
