import * as aws from '@aws-sdk/client-ses';
import { createTransport } from 'nodemailer';
import { sesClient } from './sesClient';

export const nodemailerClient = createTransport({
  SES: {
    ses: sesClient,
    aws,
  },
});
