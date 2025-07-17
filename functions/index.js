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
      subject: 'TuChinaIdeal - Comienza tu aventura',
      templateId: 'd-39759bdf93fa4799868903c99fc6f1ab',
      dynamicTemplateData: {
        duration: {
          7: 'Hasta 7 días',
          14: 'Hasta 14 días',
          15: '15 días o más'
        }[duration],
        amount: {
          1: {
            7: '69 €',
            14: '99 €',
            15: '129 €'
          },
          2: {
            7: '139 €',
            14: '169 €',
            15: '199 €'
          },
          3: {
            7: '209 €',
            14: '259 €',
            15: '299 €'
          }
        }[plan][duration],
        plan: {
          1: 'China fácil',
          2: 'China a tu medida',
          3: 'China sin barreras'
        }[plan]
      }
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