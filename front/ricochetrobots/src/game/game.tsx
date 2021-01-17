import { SubmissionModel } from "../shared/subrank"
import { Problem } from "./problem"


export type Rule = string

const WankoSoba  :Rule = "wanko"
const DontBeLate :Rule = "dblate"

export interface Game {
	id          :number
	rule        :Rule
	problem     :Problem
	subs :SubmissionModel[]
}