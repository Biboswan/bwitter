import fillDummyData from './fillDummyData.js';
import loadSchema from './loadSchema.js';

const main = async () => {
    await loadSchema();
    await fillDummyData();
};

main();
