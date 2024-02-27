/* eslint-disable max-len */

import {
  DonationGoals,
  DonationsShown,
  DonationsToShow,
  type DonationTotal,
} from '@souls-layouts/types/schemas';
import { get as nodecg } from './nodecg';

/**
 * This is where you can declare all your replicant to import easily into other files,
 * and to make sure they have any correct settings on startup.
 */
export const donationTotal = nodecg().Replicant<DonationTotal>('donationTotal');
export const nameCycleReplicant = nodecg().Replicant<number>('nameCycle');
export const donationGoals = nodecg().Replicant<DonationGoals>('donationGoals');
export const donationsToShow =
  nodecg().Replicant<DonationsToShow>('donationsToShow');
export const donationsShown =
  nodecg().Replicant<DonationsShown>('donationsShown');
export const currentOBSScene = nodecg().Replicant<string>('currentOBSScene');
