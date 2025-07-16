const {setGlobalOptions} = require('firebase-functions');
const { onRequest } = require('firebase-functions/v2/https');
const logger = require('firebase-functions/logger');

const {initializeApp} = require('firebase-admin/app');
const {getFirestore} = require('firebase-admin/firestore');

setGlobalOptions({ maxInstances: 1 });
initializeApp();

exports.addInitialContact = onRequest({ cors: ['tuchinaideal.com'] }, async (req, res) => {
   const { email, duration, fullName, nationality, plan } = req.body;
   const writeResult = await getFirestore()
        .collection('leads')
        .add({
          email,
          duration,
          fullName,
          nationality,
          plan
        });
    
    logger.info('[addInitialContact] lead added', { structuredData: true });
    res.status(200).json({result: `Message with ID: ${writeResult.id} lead added.`});
});