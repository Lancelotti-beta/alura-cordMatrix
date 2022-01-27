
function GlobalStyle(){
    return (
        <style>{`
           * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                list-style: none;
            }
            body {
                font-family: 'Open Sans', sans-serif;
            }
            /* App fit Height */ 
            html, body, #__next {
                min-height: 100vh;
                display: flex;
                flex: 1;
            }
            #__next {
                flex: 1;
            }
            #__next > * {
                flex: 1;
            }
            /* ./App fit Height */

            /* webkit scroll */
            ::-webkitscrollbar{
                width: 0.5em;
            }

            /* Track */
            :: -webkit-scrollbar-track{
                background: #CCCCCC;
            }

            /* Handle */
            :: -webkit-scrollbar-thumb{
                background: #F79596;
            }

        `}</style>
    )
}

export default function MyApp({ Component, pageProps}){
    return (
        <>
            <GlobalStyle />
            <Component {...pageProps} />
        </>
    );
}
