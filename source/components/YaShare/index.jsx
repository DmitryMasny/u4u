import React, {useRef, useEffect, useState}  from 'react';

const YaShare = ({ title = 'U4U - сервис для быстрого создания фотокниг онлайн', header }) => {
    const containerRef = useRef(null);
    const [loading, setLoading] = useState(true);

    const execScript = () => {
        if (containerRef.current && (typeof window === 'object') && ('Ya' in window) && (typeof window.Ya.share2 === 'function')) {
            window.Ya.share2(containerRef.current, {
                content: {title: title},
                theme: {lang: 'ru', services: 'vkontakte,facebook,odnoklassniki,twitter,whatsapp,telegram'}
            });
            setLoading(false);
        }
    };

    useEffect(()=>{
        if ((typeof window === 'object') && (!('Ya' in window) || (typeof window.Ya.share2 !== 'function'))) {
            const script = document.createElement("script");
            script.src = "https://yastatic.net/share2/share.js";
            script.async = true;
            script.onload = () => execScript();

            document.body.appendChild(script);
        } else execScript();
    }, [containerRef]);

    return <>
        {!loading && header || null}
        <div ref={containerRef} />
        </>;
};

export default YaShare;