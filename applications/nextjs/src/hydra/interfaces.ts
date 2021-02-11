import { OAuth2Client } from '@ory/hydra-client';

export interface ConsentProps {
  challenge: string;
  requestedScope: string[];
  user: string;
  client: OAuth2Client;
}
