const CronJob = require('cron').CronJob;

const job = new CronJob('* * * * * *', () => {
  console.log('hey');
});

job.start();


module.exports = job;