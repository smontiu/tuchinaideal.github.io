const {setGlobalOptions} = require('firebase-functions');
const { onRequest } = require('firebase-functions/v2/https');
const logger = require('firebase-functions/logger');
const sgMail = require('@sendgrid/mail');

const {initializeApp} = require('firebase-admin/app');
const {getFirestore} = require('firebase-admin/firestore');

setGlobalOptions({ maxInstances: 1 });
initializeApp();

exports.addInitialContact = onRequest({ cors: ['tuchinaideal.com'] }, async (req, res) => {
  try {
    const { email = '', duration = 0, fullName = '', nationality = '', plan = 1 } = req.body;

    sgMail.setApiKey(process.env.SENDGRID);
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
    
    const msg = {
      to: email,
      from: 'info@tuchinaideal.com',
      subject: 'Test tuchinaideal',
      text: 'test content',
      html: '<strong>html test content</strong>',
    };
    if (email) {
      await sgMail.send(msg);
    }
    logger.info('[addInitialContact] lead added', { structuredData: true });
    res.redirect('https://tuchinaideal.com/thanks')
  } catch(err) {
    logger.error('[addInitialContact] lead err', { err, structuredData: true });
    res.status(500).send();
  }
});