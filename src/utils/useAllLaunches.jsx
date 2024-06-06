import { useState, useEffect } from 'react';
import axios from 'axios';
import { LAUNCHES_API, LAUNCHPADS_API, ROCKETS_API, PAYLOADS_API } from './constants';

const useAllLaunches = () => {
  const [launchInfo, setLaunchInfo] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [launchesRes, launchpadsRes, rocketsRes, payloadsRes] = await Promise.all([
          axios.get(LAUNCHES_API),
          axios.get(LAUNCHPADS_API),
          axios.get(ROCKETS_API),
          axios.get(PAYLOADS_API)
        ]);

        const launchesData = launchesRes.data;
        const launchpadsData = launchpadsRes.data;
        const rocketsData = rocketsRes.data;
        const payloadsData = payloadsRes.data;

        const launchpadMap = {};
        launchpadsData.forEach(lp => {
          launchpadMap[lp.id] = lp.name;
        });

        const rocketMap = {};
        rocketsData.forEach(rocket => {
          rocketMap[rocket.id] = {
            name: rocket.engines.type,
            type: rocket.engines.version,
          };
        });

        const payloadMap = {};
        payloadsData.forEach(payload => {
          payloadMap[payload.id] = payload;
        });

        const enhancedLaunchData = launchesData.map(launch => {
          const payloads = launch.payloads.map(payloadId => payloadMap[payloadId]);
          const uniqueOrbits = [...new Set(payloads.map(payload => payload.orbit))];
          const uniqueManufacturers = [...new Set(payloads.map(payload => payload.manufacturer).filter(Boolean))];
          return {
            ...launch,
            launchpad_name: launchpadMap[launch.launchpad],
            rocket_name: rocketMap[launch.rocket]?.name,
            rocket_type: rocketMap[launch.rocket]?.type,
            payloads: payloads,
            orbit: uniqueOrbits.join(', '),
            manufacturer: uniqueManufacturers.join(', '),
            success: launch.success,
            upcoming: launch.upcoming
          };
        });

        setLaunchInfo(enhancedLaunchData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { launchInfo, loading };
};

export default useAllLaunches;
