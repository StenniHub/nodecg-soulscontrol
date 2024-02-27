import needle from 'needle';
import { get } from './util/nodecg';
import {
  donationTotal,
  donationGoals,
  donationsToShow,
  donationsShown,
} from './util/replicants';
import { Configschema } from '@souls-layouts/types/schemas';

const nodecg = get();
const config = (nodecg.bundleConfig as Configschema).tiltify;

let requestOptions = {
  headers: {
    Authorization: '',
  },
};

if (config && config.enable) {
  if (!config.token)
    nodecg.log.warn(
      'Tiltify support is enabled but no API access token is set.'
    );
  if (!config.campaign)
    nodecg.log.warn('Tiltify support is enabled but no campaign ID is set.');

  if (config.token && config.campaign) {
    nodecg.log.info('Tiltify integration is enabled.');
    requestOptions.headers['Authorization'] = 'Bearer ' + config.token;

    // Do the initial request, which also checks if the key is valid.
    needle.get(
      'https://v5api.tiltify.com/api/public/campaigns/' + config.campaign,
      requestOptions,
      (err, resp) => {
        if (resp.statusCode === 403) {
          nodecg.log.warn('Your Tiltify API access token is not valid.');
          return;
        }

        if (resp.statusCode === 404) {
          nodecg.log.warn(
            'The Tiltify campaign with the specified ID cannot be found.'
          );
          return;
        }

        getDonationTotal(resp.body.data);
        setInterval(updateDonationTotal, 15000); // Checks every 15 seconds.
      }
    );

    // Get goals
    needle.get(
      `https://v5api.tiltify.com/api/public/campaigns/${config.campaign}/milestones`,
      requestOptions,
      (err, resp) => {
        if (resp.statusCode === 403) {
          nodecg.log.warn('Your Tiltify API access token is not valid.');
          return;
        }

        if (resp.statusCode === 404) {
          nodecg.log.warn(
            'The Tiltify campaign with the specified ID cannot be found.'
          );
          return;
        }

        getDonationGoals(resp.body.data);
        setInterval(updateDonationGoals, 1800 * 1000); // Checks every 30 minutes.
      }
    );

    // Get 5 latest donations
    needle.get(
      `https://v5api.tiltify.com/api/public/campaigns/${config.campaign}/donations?limit=5`,
      requestOptions,
      (err, resp) => {
        if (resp.statusCode === 403) {
          nodecg.log.warn('Your Tiltify API access token is not valid.');
          return;
        }

        if (resp.statusCode === 404) {
          nodecg.log.warn(
            'The Tiltify campaign with the specified ID cannot be found.'
          );
          return;
        }

        getDonationsToShow(resp.body.data);
        setInterval(updateDonationsToShow, 60000 * 5); // Checks every 5 minutes.
      }
    );
  }
}

function updateDonationTotal() {
  needle.get(
    'https://v5api.tiltify.com/api/public/campaigns/' + config.campaign,
    requestOptions,
    (err, resp) => {
      if (!err && resp.statusCode === 200) getDonationTotal(resp.body.data);
    }
  );
}

function updateDonationGoals() {
  needle.get(
    `https://v5api.tiltify.com/api/public/campaigns/${config.campaign}/milestones`,
    requestOptions,
    (err, resp) => {
      if (!err && resp.statusCode === 200) getDonationGoals(resp.body.data);
    }
  );
}

function updateDonationsToShow() {
  needle.get(
    `https://v5api.tiltify.com/api/public/campaigns/${config.campaign}/donations?limit=5`,
    requestOptions,
    (err, resp) => {
      if (!err && resp.statusCode === 200) getDonationsToShow(resp.body.data);
    }
  );
}

/** Handles updating the donation total. */
function getDonationTotal(data: { amount_raised: { value: string } }) {
  const amount = parseInt(data.amount_raised.value);
  // Update the donation total replicant if it has actually changed.
  if (donationTotal.value !== amount) donationTotal.value = amount;
}

/** Formats the goals to show on the omnibar. */
function getDonationGoals(data: { name: string; amount: { value: string } }[]) {
  // Clean the replicant data before proceeding
  donationGoals.value = [];
  for (let index = 0; index < data.length; index++) {
    const rawGoal = data[index];
    const goal = {
      name: rawGoal.name,
      amount: parseInt(rawGoal.amount.value),
    };
    donationGoals.value.push(goal);
  }
}

/** Formats the donations to show on the omnibar. */
function getDonationsToShow(
  data: {
    id: string;
    donor_name: string;
    amount: { value: string };
  }[]
) {
  for (let index = 0; index < data.length; index++) {
    const donation = data[index];
    const formattedDonation = {
      id: donation.id,
      name: donation.donor_name,
      amount: parseInt(donation.amount.value),
    };

    // Don't add again if donation was already shown or is already in the list
    if (
      !donationsShown.value!.includes(formattedDonation.id) &&
      !donationsToShow.value!.includes(formattedDonation)
    ) {
      donationsToShow.value.push(formattedDonation);
    }
  }
}
