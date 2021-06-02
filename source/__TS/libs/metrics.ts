const yaCounterId = 48657347;
declare global {
    interface Window {
        gtag: any;
        ym: any;
    }
}

export const METRICS = {
    ORDER_CALENDAR: ['order', 'calendar'],
}

/**
 * Отправка аналитики в гугл и яндекс
 */
export const sendMetric = ( target: string[] ) => {
    console.log('window.gtag', window.gtag);
    console.log('target', target);
    if (!target) return null;
    if (window.gtag) {
        window.gtag('event', 'sending', {
            'event_category': target[0],
            'event_label': target[1],
        });
    }
    if (window.ym) {
        window.ym(yaCounterId,'reachGoal', `${target[0]}_${target[1]}`)
    }
};