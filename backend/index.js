import express from 'express';
import fillDummyData from './fillDummyData.js';
import loadSchema from './loadSchema.js';

const app = express();
const PORT = 5000;

const main = async () => {
    await loadSchema();
    await fillDummyData();
    app.listen(PORT, () => console.log(`app listening on port ${PORT}`));
};

main();
