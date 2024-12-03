export default interface HelpfullnessVote {
  vote_id: number;
  user_id: string;
  experience_id: number;
  helpfulness: "up" | "down";
}
