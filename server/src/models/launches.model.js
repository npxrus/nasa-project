const launchesDb = require('./launches.mongo');

const launches = new Map();

let latestFlightNumber = 100;

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

async function getAllLaunches() {
  return await launchesDb.find({}, { _id: 0, __v: 0 });
}

async function saveLaunch(launch) {
  await launchesDb.updateOne({ flightNumber: launch.flightNumber }, launch, {
    upsert: true,
  });
}

function addNewLaunch(launch) {
  latestFlightNumber++;
  launches.set(
    latestFlightNumber,
    Object.assign(launch, {
      flightNumber: latestFlightNumber,
      customers: ['Zero To Mastery', 'NASA'],
      upcoming: true,
      success: true,
    })
  );
}

function abortLaunch(launchId) {
  const aborted = launches.get(launchId);
  aborted.upcoming = false;
  aborted.success = false;

  return aborted;
}

module.exports = { getAllLaunches, addNewLaunch, isLaunchExists, abortLaunch };
