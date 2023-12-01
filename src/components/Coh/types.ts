export type CohDonation = {
  btcAmount: number;
  comment: string;
  donatedAt: {
    day: number;
    hour: number;
    millisecond: number;
    minute: number;
    month: number;
    second: number;
    year: number;
  };
  firstName: string;
  lastName: string;
  usdAmount: number;
};

export type CohDonations = {
  donations: [CohDonation];
  total_btc: number;
  total_usd: number;
};
