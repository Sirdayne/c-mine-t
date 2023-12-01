export interface AboutTeamMember {
  id: string;
  name: string;
  jobTitle: string | null;

  // full URL to avatar like s3.cointelegraph.com/...
  avatarUrl: string;

  // URL to team member maybe
  // example: /authors/some-slug
  url: string | null;

  // just an email address
  emailAddress: string | null;

  // social full URLs like https://twitter.com/...
  linkedinUrl: string | null;
  twitterUrl: string | null;
}
