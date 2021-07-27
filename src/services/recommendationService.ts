import getYouTubeID from "get-youtube-id";
import { Recommendation, RecommendationScore } from "../interfaces/recommendation";

import * as recommendationRepository from "../repositories/recommendationRepository";

export async function saveRecommendation(rec:Recommendation) {
  const youtubeId = getYouTubeID(rec.youtubeLink);

  if (youtubeId === null) {
    return null;
  }

  const initialScore:number = 0;

  const recommendation: RecommendationScore = {score: initialScore, name: rec.name, youtubeLink: rec.youtubeLink }

  return await recommendationRepository.create(recommendation);
}

export async function upvoteRecommendation(id: number) {
  return await changeRecommendationScore(id, 1);
}

export async function downvoteRecommendation(id: number) {
  const recommendation = await recommendationRepository.findById(id);
  if (recommendation.score === -5) {
    return await recommendationRepository.destroy(id);
  } else {
    return await changeRecommendationScore(id, -1);
  }
}

export async function getRandomRecommendation() {
  const random = Math.random();

  let recommendations;
  const orderBy = "RANDOM()";

  if (random > 0.7) {
    recommendations = await recommendationRepository.findRecommendations(
      -5,
      10,
      orderBy
    );
  } else {
    recommendations = await recommendationRepository.findRecommendations(
      11,
      Infinity,
      orderBy
    );
  }

  return recommendations[0];
}

async function changeRecommendationScore(id: number, increment: number) {
  const result = await recommendationRepository.incrementScore(id, increment);
  return result.rowCount === 0 ? null : result;
}
