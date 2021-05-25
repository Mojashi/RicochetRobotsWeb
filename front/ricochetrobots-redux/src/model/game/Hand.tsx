import { Dir } from "./Dir"
import { Robot } from "./Robot"

export interface Hand {
	robot: Robot,
	dir : Dir
}