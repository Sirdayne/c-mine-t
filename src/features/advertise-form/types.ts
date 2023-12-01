export type CerosForm = {
  name: string;
  email: string;
  messenger: string;
  messaging: string;
  website: string;
  region: string;
};

export type CerosMessageEvent = {
  data: string | object;
};

export type CerosEventFunction = {
  args: Array<string | CerosEventAction>;
  functionPath: string;
};

type CerosEventAction = {
  event_label: string;
};
