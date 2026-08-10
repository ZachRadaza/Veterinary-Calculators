import { RecoveryDietDensity, RecoveryDietOptions } from "./RecoveryDietOptions";

const FeedTubeHelper = {

    calculateFeedingTube(weightKg, recoveryDiet, daysUntil100, numFeedings, densityValues, isDiluting, dilutingVolumes){
        const weight = Number(weightKg);
        const days = Number(daysUntil100);
        const feedings = Number(numFeedings);

        if(weight <= 0 || days <= 0 || feedings <= 0)
            return null;

        const rer = this.calculateRER(weight);

        const originalDensity = this.calculateOriginalDensity(densityValues, recoveryDiet);

        if(originalDensity <= 0)
            return null;
        
        let energyDensity = originalDensity;
        let dilutionPercent = 100;

        if(isDiluting){
            energyDensity = this.calculateDilutedDensity(
                originalDensity,
                dilutingVolumes.volumeProduct,
                dilutingVolumes.volumeWater
            );

            dilutionPercent = this.calculateDilutionPercent(
                dilutingVolumes.volumeProduct,
                dilutingVolumes.volumeWater
            );

            if(energyDensity <= 0)
                return null;
        }

        const dailyVolumeAt100 = rer / energyDensity;

        const volumePerFeedingAt100 = dailyVolumeAt100 / feedings;

        const schedule = this.calculateFeedingSchedule(
            rer,
            energyDensity,
            days,
            feedings
        );

        return {
            rer,
            originalDensity,
            energyDensity,
            isDiluting,
            dilutionPercent,
            daysUntil100: days,
            numFeedings: feedings,
            dailyVolumeAt100,
            volumePerFeedingAt100,
            schedule
        };
    },


    calculateRER(weightKg){
        if(weightKg <= 0)
            return 0;

        return 70 * Math.pow(weightKg, 0.75);
    },


    calculateOriginalDensity(densityValues, recoveryDiet){
        const predefinedDensity = RecoveryDietDensity[recoveryDiet];

        if(recoveryDiet !== RecoveryDietOptions.OTHER && predefinedDensity != null)
            return predefinedDensity;

        const direct = Number(densityValues.direct);
        const kcal = Number(densityValues.perCanKcal);
        const ml = Number(densityValues.perCanMl);

        if(direct > 0)
            return direct;

        if(kcal > 0 && ml > 0)
            return kcal / ml;

        return 0;
    },


    calculateDilutedDensity(originalDensity, volumeProduct, volumeWater){
        const product = Number(volumeProduct);
        const water = Number(volumeWater);

        const totalVolume = product + water;

        if(originalDensity <= 0 || product <= 0 || totalVolume <= 0)
            return 0;

        return originalDensity * (product / totalVolume);
    },


    calculateDilutionPercent(volumeProduct, volumeWater){
        const product = Number(volumeProduct);
        const water = Number(volumeWater);

        const totalVolume = product + water;

        if(product <= 0 || totalVolume <= 0)
            return 0;

        return (product / totalVolume) * 100;
    },


    calculateFeedingSchedule(rer, energyDensity, daysUntil100, numFeedings){
        if(rer <= 0 || energyDensity <= 0 || daysUntil100 <= 0 || numFeedings <= 0)
            return [];

        const schedule = [];

        for(let day = 1; day <= daysUntil100; day++){
            const fractionOfRER = day / daysUntil100;

            const percentRER = fractionOfRER * 100;
            const kcalPerDay = rer * fractionOfRER;
            const volumePerDay = kcalPerDay / energyDensity;
            const volumePerFeeding = volumePerDay / numFeedings;

            schedule.push({
                day,
                percentRER,
                kcalPerDay,
                volumePerDay,
                volumePerFeeding
            });
        }

        return schedule;
    }

};

export default FeedTubeHelper;