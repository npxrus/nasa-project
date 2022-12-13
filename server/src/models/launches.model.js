const launchesDb = require('./launches.mongo');
const planets = require('./planets.mongo');
const DEFAULT_FLIGHT_NUMBER = 100;

const launches = new Map();

const launch = {
  flightNumber: 100,
  launchDate: new Date('December 27, 2030'),
  mission: 'Kepler Exploration X',
  rocket: 'Explorer IS1',
  target: 'Kepler-442 b',
  customers: ['ZTM', 'NASA'],
  upcoming: true,
  success: true,
};

saveLaunch(launch);

function isLaunchExists(launchId) {
  return launches.has(launchId);
}

async function getLatestFlightNumber() {
  const latestLaunch = await launchesDb.findOne().sort('-flightNumber');

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber;
}

async function getAllLaunches() {
  return await launchesDb.find({}, { _id: 0, __v: 0 });
}

async function saveLaunch(launch) {
  const planet = await planets.findOne({ keplerName: launch.target });

  if (!planet) {
    throw new Error('No matching planet found');
  }

  await launchesDb.updateOne({ flightNumber: launch.flightNumber }, launch, {
    upsert: true,
  });
}

async function scheduleNewLaunch(launch) {
  const newFlightNumber = (await getLatestFlightNumber()) + 1;

  const newLaunch = {
    ...launch,
    success: true,
    upcoming: true,
    customers: ['ZeroToMaster', 'NASA'],
    flightNumber: newFlightNumber,
  };

  await saveLaunch(newLaunch);
}

function abortLaunch(launchId) {
  const aborted = launches.get(launchId);
  aborted.upcoming = false;
  aborted.success = false;

  return aborted;
}

module.exports = {
  getAllLaunches,
  scheduleNewLaunch,
  isLaunchExists,
  abortLaunch,
};
