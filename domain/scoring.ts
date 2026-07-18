export type ScoreDimensionKey = "problemUrgency"|"transformationClarity"|"audienceSpecificity"|"willingnessToPay"|"founderCredibility"|"curriculumStrength"|"engagementRetention"|"acquisitionFeasibility"|"operationalSafety";
export type ScoreValues = Record<ScoreDimensionKey, number>;
export type ScoreBand = "ready"|"strong"|"promising"|"validate";
export const SCORE_WEIGHTS: Record<ScoreDimensionKey, number> = { problemUrgency:15, transformationClarity:15, audienceSpecificity:10, willingnessToPay:15, founderCredibility:10, curriculumStrength:10, engagementRetention:10, acquisitionFeasibility:10, operationalSafety:5 };
export function scoreBand(total:number):ScoreBand { return total>=85?"ready":total>=70?"strong":total>=50?"promising":"validate"; }
export function calculateLaunchScore(values:ScoreValues){ const raw=(Object.keys(SCORE_WEIGHTS) as ScoreDimensionKey[]).reduce((sum,key)=>sum+values[key]*(SCORE_WEIGHTS[key]/100),0); const total=Math.round(raw); return {total,band:scoreBand(total),raw}; }
export const INITIAL_SCORE_VALUES:ScoreValues={problemUrgency:80,transformationClarity:80,audienceSpecificity:80,willingnessToPay:70,founderCredibility:80,curriculumStrength:80,engagementRetention:70,acquisitionFeasibility:35,operationalSafety:100};
