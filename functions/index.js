const {setGlobalOptions} = require('firebase-functions');
const { onRequest } = require('firebase-functions/v2/https');
const logger = require('firebase-functions/logger');
const sgMail = require('@sendgrid/mail');
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

    sgMail.setApiKey(process.env.SENDGRID);
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

    const mapPlan = {
      1: 'China fácil',
      2: 'China a tu medida',
      3: 'China sin barreras'
    }[plan] || '';
    const mapAmount = {
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
    }[plan][duration] || '';
    const mapDuration = {
      7: 'Hasta 7 días',
      14: 'Hasta 14 días',
      15: '15 días o más'
    }[duration] || '';
    
    const msg = {
      to: email,
      from: 'info@tuchinaideal.com',
      replyTo: 'info@tuchinaideal.com',
      subject: 'TuChinaIdeal - Comienza tu aventura',
      templateId: 'd-39759bdf93fa4799868903c99fc6f1ab',
      dynamicTemplateData: {
        duration: mapDuration,
        amount: mapAmount,
        plan: mapPlan,
        reference
      }
    };
    const msgInternal = {
      to: 'tuchinaideal@gmail.com',
      from: 'info@tuchinaideal.com',
      subject: 'New lead',
      html: `<h1>New lead</h1><p>email: ${email}</p><p>plan: ${mapPlan}</p><p>amount: ${mapAmount}</p><p>duration: ${mapDuration}</p><p>booking reference: ${reference}</p>`
    };
    if (email) {
      await sgMail.send(msg);
      await sgMail.send(msgInternal);
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

    sgMail.setApiKey(process.env.SENDGRID);
    const msgInternal = {
      to: 'tuchinaideal@gmail.com',
      from: 'info@tuchinaideal.com',
      subject: 'New contact',
      html: `<h1>New Contact from landing</h1><p>email: ${email}</p><p>content: ${content}</p>`
    };
    if (email && content) {
      await sgMail.send(msgInternal);
    }
    logger.info('[contactForm] contact', { structuredData: true });
    res.redirect('https://tuchinaideal.com/thanks');
  } catch(err) {
    logger.error('[contactForm] contact err', { err, structuredData: true });
    res.status(500).send();
  }
});