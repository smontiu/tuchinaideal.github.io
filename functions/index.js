const {setGlobalOptions} = require('firebase-functions');
const { onRequest } = require('firebase-functions/v2/https');
const logger = require('firebase-functions/logger');
const { TransactionalEmailsApi, SendSmtpEmail } = require('@getbrevo/brevo');
const { customAlphabet } = require('nanoid');

const {initializeApp} = require('firebase-admin/app');
const {getFirestore} = require('firebase-admin/firestore');

setGlobalOptions({ maxInstances: 1 });
initializeApp();

exports.addInitialContact = onRequest({ cors: ['tuchinaideal.com'] }, async (req, res) => {
  try {
    const { email = '', duration = 0, fullName = '', nationality = '', plan = 1, privacyCheck = false } = req.body;
    const seed = customAlphabet('1234567890abcdefghijklmnoprsqwzxy', 10);
    const reference = seed();

    const emailAPI = new TransactionalEmailsApi();
    
    emailAPI.authentications.apiKey.apiKey = process.env.BREVO;
    if (email) {
      await getFirestore()
        .collection('leads')
        .add({
          email,
          duration,
          fullName,
          nationality,
          plan,
          reference,
          privacyCheck,
          createdAt: +new Date()
        });
    }

    const mapPlan = {
      1: 'China fácil',
      2: 'China a tu medida',
      3: 'China sin barreras',
      4: 'China express'
    }[plan] || '';
    const mapAmount = {
      1: {
        7: '69 € / 80 $',
        14: '99 € / 116 $',
        15: '129 € / 151 $'
      },
      2: {
        7: '139 € / 161 $',
        14: '169 € / 198 $',
        15: '199 € / 234 $'
      },
      3: {
        7: '209 € / 243 $',
        14: '259 € / 304 $',
        15: '299 € / 351 $'
      },
      4: {
        7: '40 € / 46 $',
        14: '40 € / 46 $',
        15: '40 € / 46 $'
      }
    }[plan][duration] || '';
    const mapDuration = {
      7: 'Hasta 7 días',
      14: 'Hasta 14 días',
      15: '15 días o más'
    }[duration] || '';

    const dur = plan === '4' ? '1 hora' : mapDuration;
    
    const msg = new SendSmtpEmail();
    msg.to = { email };
    msg.from = { email: 'info@tuchinaideal.com' };
    msg.templateId = 1;
    msg.subject = 'TuChinaIdeal - Comienza tu aventura';
    msg.params = {
      duration: dur,
      amount: mapAmount,
      plan: mapPlan,
      reference
    };
    const msgInternal = new SendSmtpEmail();
    msgInternal.to = { email: 'tuchinaideal@gmail.com' };
    msgInternal.sender = { email: 'info@tuchinaideal.com' };
    msgInternal.subject = 'New lead';
    msgInternal.htmlContent = `<h1>New lead</h1><p>email: ${email}</p><p>plan: ${mapPlan}</p><p>amount: ${mapAmount}</p><p>duration: ${dur}</p><p>booking reference: ${reference}</p>`;

    if (email) {
      await emailAPI.sendTransacEmail(msg);
      await emailAPI.sendTransacEmail(msgInternal);
    }
    logger.info('[addInitialContact] lead added', { structuredData: true });
    res.redirect('https://tuchinaideal.com/thanks');
  } catch(err) {
    logger.error('[addInitialContact] lead err', { err, structuredData: true });
    res.status(500).send();
  }
});

exports.contactForm = onRequest({ cors: ['tuchinaideal.com'] }, async (req, res) => {
  try {
    const { email = '', content = '' } = req.body;
    const emailAPI = new TransactionalEmailsApi();
    emailAPI.authentications.apiKey.apiKey = process.env.BREVO;
    const msgInternal = new SendSmtpEmail();

    msgInternal.to = { email: 'tuchinaideal@gmail.com' };
    msgInternal.sender = { email: 'info@tuchinaideal.com' };
    msgInternal.subject = 'New contact';
    msgInternal.htmlContent = `<h1>New Contact from landing</h1><p>email: ${email}</p><p>content: ${content}</p>`;

    if (email && content) {
      await emailAPI.sendTransacEmail(msgInternal);
    }
    logger.info('[contactForm] contact', { structuredData: true });
    res.redirect('https://tuchinaideal.com/thanks');
  } catch(err) {
    logger.error('[contactForm] contact err', { err, structuredData: true });
    res.status(500).send();
  }
});