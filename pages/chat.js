import { Box, Text, TextField, Image, Button, Icon } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';
import { SendSticker } from  '../src/componentes/SendSticker';


const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzMyMjQ5MCwiZXhwIjoxOTU4ODk4NDkwfQ.EPhlDwI14J03pEM6ZbhItdjzlPAYRQvfP7J3VEY70X4';
const SUPABASE_URL = 'https://hsaimhnbmvhbeqnedfpv.supabase.co';
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function messageRealTime(addMessage){
  return supabaseClient
    .from('mensagens')
    .on('INSERT', ({ respostaLive }) => {
      addMessage(respostaLive.new)
    })
    .subscribe();
}

export default function ChatPage() {
  const roteamento = useRouter();
  const userOn = roteamento.query.username;


  /* User */
  //Digitar no Campo TextArea
  //aperta enter para enviar
  //dicionar o texto em uma Lista li
  //User ver a mensagem com suas info de conta
  //User clica no botão para enviar mensagem 
  //User usa sticker 
  //User recebe mensagem em tempo real
  //User pode apagar mensagens já enviadas

  /* Dev */
  //[X] Campo Criado
  //[X] Vamos usar onChange usar useState (ter um 'if' para caso enter for precionado limpar a variavel )
  //[x] Lista de mensagens
  //[X] desenvolver um botão de enviar com 'clic'
  //[] desenvolver uma função para apagar mensagem 
  //[x] Sticker funcionando
  //[] Atualizar o back-end para receber as mensagem em real time
  //[X] criar um "mine sever" /* acho que é isso mesmo */


 
  const [mensagem, setMensagem] = React.useState('');
  const [listaMensagem, setListaMensagem] = React.useState([]);

  React.useEffect(() => {
    supabaseClient
      .from('mensagens')
      .select('*')
      .order('id', {ascending: false})
      .then(({data}) => {
        // console.log('dados do sever: ', data);
        setListaMensagem(data);
      });

    messageRealTime((novaMensagem) => {
      // handleNovaMensagem(novaMensagem)
      setListaMensagem((listaValorAtual) => {
        return [
          novaMensagem,
          ...listaValorAtual,
        ]
      });
    });
  }, []);

  function handleNovaMensagem(novaMensagem) {
    const mensagem = {
      // id: listaMensagem.length + 1,
      de: userOn,
      texto: novaMensagem,
    }

    supabaseClient
      .from('mensagens')
      .insert([
        mensagem
      ])
      .then(({ data }) => {
        console.log(`O que esta recebendo? ${data}`);
      })

    setMensagem('');
  }

  

  return (
    <Box
      styleSheet={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: appConfig.theme.colors.primary[1000],
        backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
        backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
        color: appConfig.theme.colors.neutrals['300']
      }}
    >
      <Box
        styleSheet={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
          borderRadius: '5px',
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: '100%',
          maxWidth: '95%',
          maxHeight: '95vh',
          padding: '32px',
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: 'relative',
            display: 'flex',
            flex: 1,
            height: '80%',
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: 'column',
            borderRadius: '5px',
            padding: '16px',
          }}
        >

          <MessageList mensagem={listaMensagem} />

          {/* {listaMensagem.map((mensagemEnviada) => {
            return (
              <li key={mensagemEnviada.id}>
                {mensagemEnviada.de}: {mensagemEnviada.texto}
              </li>
            )
          })} */}


          <Box
            as="form"
            styleSheet={{
              width: '100%', marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}

          >
            
            <TextField


              value = { mensagem }
              onChange = {(event) => {
                const valor = event.target.value;
                setMensagem(valor);
              }}

              onKeyPress = {(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  handleNovaMensagem(mensagem);
                }
              }}

              placeholder="Insira sua mensagem aqui..."
              type="textarea"
              styleSheet={{
                width: '70%',
                height: '100%',
                border: '0',
                resize: 'none',
                borderRadius: '5px',
                padding: '6px 8px',
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: '12px',
                color: appConfig.theme.colors.neutrals[200],
              }}
            />

            {/* CallBack */}
            <SendSticker 
              onStickerClick={(sticker) => {
                //console.log('[USANDO O COMPONENTE] clicou no sticker ' + sticker);
                handleNovaMensagem(`_:Sticker:_${sticker}`);
              }}
            />

            <Button

              value = {mensagem}
              onClick={(event) => {
                event.preventDefault();
                handleNovaMensagem(mensagem);
              }}
            
              colorVariant="dark"
              fullWidth
              iconName="arrowRight"
              size="lg"
              variant='primary'
              styleSheet={{
                borderRadius: '50%',
                padding: '0 3px 0 0',
                minWidth: '50px',
                minHeight: '50px',
                fontSize: '20px',
                marginBottom: '8px',
                lineHeight: '0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}

              buttonColors={{
                contrastColor: appConfig.theme.colors.neutrals["000"],
                mainColor: appConfig.theme.colors.neutrals[600],
                mainColorLight: appConfig.theme.colors.primary[400],
                mainColorStrong: appConfig.theme.colors.primary[600],
                
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

function Header() {
  return (
    <>
      <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
        <Text variant='heading5'>
          Chat
        </Text>
        <Button
          variant='tertiary'
          colorVariant='neutral'
          label='Logout'
          href="/"
        />
      </Box>
    </>
  )
}


function MessageList(props) {
  console.log(props);
  return (
    <Box
      tag="ul"
      styleSheet={{
        overflowX: 'hidden',
        overflowY: 'scroll',
        display: 'flex',
        flexDirection: 'column-reverse',
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: '16px',
      }}
    >
      {props.mensagem.map((mensagem) =>{
        return(
          <Text
            key={mensagem.id}
            tag="li"
            styleSheet={{
              borderRadius: '5px',
              padding: '6px',
              marginBottom: '12px',
              hover: {
                backgroundColor: appConfig.theme.colors.neutrals[700],
              }
            }}
          >
            <Box
              styleSheet={{
                marginBottom: '8px',
              }}
            >
              <Image
                styleSheet={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  display: 'inline-block',
                  marginRight: '8px',
                }}
                src={`https://github.com/${mensagem.de}.png`}
              />
              <Text tag="strong">
              {mensagem.de}
              </Text>
              <Text
                styleSheet={{
                  fontSize: '10px',
                  marginLeft: '8px',
                  color: appConfig.theme.colors.neutrals[300],
                }}
                tag="span"
              >
                {(new Date().toLocaleDateString())}
              </Text>
            </Box>
            {/* Condicional: {mensagem.texto.startsWith(':Sticker:').toString()} */}
            {mensagem.texto.startsWith('_:Sticker:_') 
            ? (
              <Image src={mensagem.texto.replace('_:Sticker:_', '')} />
            )
            : (
              mensagem.texto
            )}

            {/* {mensagem.texto} */}
          </Text>

        );
      })}
    </Box>
  )
}