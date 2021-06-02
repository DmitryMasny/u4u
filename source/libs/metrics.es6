/**
 * Отсылка ключевого действия для метрики-аналитики
 * @param target {String} - ключ метрики
 */
const sendMetric = ( target ) => {
    // console.log('send metric ',target );
    if (!window.ga) {
        //console.log('отсутствует window.ga');
    } else {
        window.ga('send', 'event', 'button', target);
    }

    if (!window.yaCounter48657347) {
        //console.log('отсутствует window.yaCounter48657347');
    } else {
        yaCounter48657347.reachGoal(target);
    }
};

export default sendMetric;