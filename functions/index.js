const {setGlobalOptions} = require('firebase-functions');
const { onRequest } = require('firebase-functions/v2/https');
const logger = require('firebase-functions/logger');
const path = require('node:path');

const {initializeApp} = require('firebase-admin/app');
const {getFirestore} = require('firebase-admin/firestore');

setGlobalOptions({ maxInstances: 1 });
initializeApp();

exports.addInitialContact = onRequest({ cors: ['tuchinaideal.com'] }, async (req, res) => {
   const { email, duration = 0, fullName = '', nationality = '', plan = 1 } = req.body;
   await getFirestore()
      .collection('leads')
      .add({
        email,
        duration,
        fullName,
        nationality,
        plan,
        createdAt: +new Date()
      });
    
    logger.info('[addInitialContact] lead added', { structuredData: true });
    res.status(200).type('html').sendFile(path.join(__dirname, 'thanks.html'));
});