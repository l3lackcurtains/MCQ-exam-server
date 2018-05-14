import schedule from 'node-schedule';
import Usermeta from '../models/usermeta';

const rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [6];
rule.hour = [22, 23];
rule.minute = [0, 30];

schedule.scheduleJob(rule, async () => {
  try {
    const usermeta = await Usermeta.find({}, '_id');
    if (!usermeta) console.log('Error getting usermeta.');
    await usermeta.forEach(async um => {
      try {
        const newUserMeta = await Usermeta.findOne({ _id: um._id }); // eslint-disable-line
        if (!newUserMeta) console.log('Usermeta id is invalid.');
        newUserMeta.set({
          totalPoint: newUserMeta.totalPoint + newUserMeta.weeklyPoint,
          weeklyPoint: 0
        });
        const updateUsermeta = await newUserMeta.save();
        if (!updateUsermeta) console.log('Error updating usermeta.');
        console.log('Usermeta updated successfully for', um.id, updateUsermeta);
      } catch (ey) {
        console.log('Error with each usermeta update.', ey);
      }
    });
  } catch (ex) {
    console.log('Error with whole update.', ex);
  }
});
