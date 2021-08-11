import {Submission} from "../../Submission/model/Submission";

export interface HackerrankJSON {
  username: string;
  email: string;
  country: string;
  name: string;
  website: string;
  job_title: string;
  github_url: string;
  fb_uid: string;
  gh_uid: string;
  li_uid: string;
  linkedin_url: string;
  personal_first_name: string;
  personal_last_name: string;
  timezone: string;
  is_professional: boolean;
  hackos: number;
  favorite_challenges: any[];
  challenges_created: any[];
  other_emails: any[];
  all_schools: any[];
  snippets: any[];
  submissions: Submission[];
  teams: any[];
  contest_participations: any[];
  forum_comments: any[];
  all_ratings: any[];
  contest_medals: any[];
  survery_results: any[];
  messages_sent: any[];
  run_codes: any[];
  contests_created: any[];
  job_applications: any[];
  skills_tes: any[];
}
