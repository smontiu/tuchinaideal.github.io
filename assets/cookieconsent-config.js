import 'https://cdn.jsdelivr.net/gh/orestbida/cookieconsent@3.1.0/dist/cookieconsent.umd.js';

CookieConsent.run({
    guiOptions: {
        consentModal: {
            layout: "box",
            position: "bottom center",
            equalWeightButtons: true,
            flipButtons: true
        },
        preferencesModal: {
            layout: "box",
            position: "right",
            equalWeightButtons: true,
            flipButtons: true
        }
    },
    categories: {
        necessary: {
            readOnly: true
        },
        analytics: {}
    },
    language: {
        default: "es",
        autoDetect: "browser",
        translations: {
            en: {
                consentModal: {
                    title: "Hello traveller, it's cookie time!",
                    description: "We use cookies to improve your experience, analyze traffic, and personalize content. You can choose which categories to accept or reject. For more details, see our policies.",
                    acceptAllBtn: "Accept all",
                    acceptNecessaryBtn: "Reject all",
                    showPreferencesBtn: "Manage preferences",
                    footer: "<a href=\"/policy/\">Privacy Policy</a>\n<a href=\"/terms/\">Terms and Conditions</a>"
                },
                preferencesModal: {
                    title: "Consent Preferences Center",
                    acceptAllBtn: "Accept all",
                    acceptNecessaryBtn: "Reject all",
                    savePreferencesBtn: "Save preferences",
                    closeIconLabel: "Close modal",
                    serviceCounterLabel: "Service|Services",
                    sections: [
                        {
                            title: "Cookie Usage",
                            description: "We use cookies to ensure the website works properly, to understand how you interact with it, and to tailor our services to your interests."
                        },
                        {
                            title: "Strictly Necessary Cookies <span class=\"pm__badge\">Always Enabled</span>",
                            description: "These cookies are essential for the website to function and cannot be disabled. They are usually set in response to your actions, such as setting privacy preferences or filling out forms.",
                            linkedCategory: "necessary"
                        },
                        {
                            title: "Analytics Cookies",
                            description: "These cookies help us understand how visitors interact with the website, so we can improve it. All data is collected anonymously.",
                            linkedCategory: "analytics"
                        },
                        {
                            title: "More information",
                            description: "For any questions about our cookie policy and your choices, please <a class=\"cc__link\" href=\"mailto:contacto@tuchinalideal.com\">contact us</a>."
                        }
                    ]
                }
            },
            es: {
                consentModal: {
                    title: "Hola viajero, ¡es hora de las cookies!",
                    description: "Usamos cookies para mejorar tu experiencia, analizar el tráfico y personalizar el contenido. Puedes elegir qué categorías aceptar o rechazar. Para más información, consulta nuestras políticas.",
                    acceptAllBtn: "Aceptar todo",
                    acceptNecessaryBtn: "Rechazar todo",
                    showPreferencesBtn: "Gestionar preferencias",
                    footer: "<a href=\"/policy/\">Política de privacidad</a>\n<a href=\"/terms/\">Términos y condiciones</a>"
                },
                preferencesModal: {
                    title: "Centro de Preferencias de Consentimiento",
                    acceptAllBtn: "Aceptar todo",
                    acceptNecessaryBtn: "Rechazar todo",
                    savePreferencesBtn: "Guardar preferencias",
                    closeIconLabel: "Cerrar modal",
                    serviceCounterLabel: "Servicios",
                    sections: [
                        {
                            title: "Uso de Cookies",
                            description: "Utilizamos cookies para garantizar el correcto funcionamiento del sitio web, comprender cómo interactúas con él y adaptar nuestros servicios a tus intereses."
                        },
                        {
                            title: "Cookies estrictamente necesarias <span class=\"pm__badge\">Siempre habilitadas</span>",
                            description: "Estas cookies son esenciales para que el sitio funcione y no se pueden desactivar. Normalmente se configuran en respuesta a tus acciones, como establecer preferencias de privacidad o rellenar formularios.",
                            linkedCategory: "necessary"
                        },
                        {
                            title: "Cookies de análisis",
                            description: "Estas cookies nos ayudan a entender cómo los visitantes usan el sitio web, para poder mejorarlo. Todos los datos se recopilan de forma anónima.",
                            linkedCategory: "analytics"
                        },
                        {
                            title: "Más información",
                            description: "Si tienes preguntas sobre nuestra política de cookies y tus opciones, por favor <a class=\"cc__link\" href=\"mailto:contacto@tuchinalideal.com\">contáctanos</a>."
                        }
                    ]
                }
            }
        }
    },
    disablePageInteraction: true
});