import React, { useEffect } from 'react';
import { useSelector } from "react-redux";
import {userIdSelector, userPersonalInfoSelector, userRoleSelector} from "../../selectors/user";

const Analytics = () => {

    if ( process.env.server_render ) return null;

    const userId = useSelector(userIdSelector);
    const userRole = useSelector(userRoleSelector);
    const userData = useSelector(userPersonalInfoSelector);

    const userLogin = userData && userData.phone ||
                      userData && userData.email || '';

    useEffect(() => {
        if (window.location.host !== 'localhost' && userId && typeof ym === 'undefined') {
            // GoogleAnalytics
            (function (i, s, o, g, r, a, m) {
                i['GoogleAnalyticsObject'] = r;
                i[r] = i[r] || function () {
                    (i[r].q = i[r].q || []).push(arguments)
                }, i[r].l = 1 * new Date();
                a = s.createElement(o),
                    m = s.getElementsByTagName(o)[0];
                a.async = 1;
                a.src = g;
                m.parentNode.insertBefore(a, m)
            })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

            ga('create', 'UA-100555772-1', 'auto');
            ga('send', 'pageview');

            window.dataLayer = window.dataLayer || [];

            function gtag() {
                dataLayer.push(arguments);
            }

            gtag('js', new Date());

            gtag('config', 'UA-100555772-1');


            // Yandex.Metrika counter
            (function (m, e, t, r, i, k, a) {
                m[i] = m[i] || function () {
                    (m[i].a = m[i].a || []).push(arguments)
                };
                m[i].l = 1 * new Date();
                k = e.createElement(t), a = e.getElementsByTagName(t)[0], k.async = 1, k.src = r, a.parentNode.insertBefore(k, a)
            })
            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

            ym(48657347, "init", {
                clickmap: true,
                trackLinks: true,
                accurateTrackBounce: true,
                // webvisor:true,
                ecommerce: "dataLayer"
            });
        }
    }, [userId]);

    useEffect(()=>{
        if (window.location.host !== 'localhost' && userId) {
            if ( typeof ym !== 'undefined' ) {

                ym(48657347, 'userParams', {
                    UserID: userId,
                    UserRole: userRole,
                    UserLogin: userLogin
                });

            }
        }
    },[userId, userRole, userLogin ]);

    return null;
};

export default Analytics;
